import re
import smtplib
from email.message import EmailMessage

from fastapi import APIRouter, HTTPException

from ..utils import get_config, save_config

router = APIRouter()
EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def _is_email(value: str) -> bool:
    return bool(EMAIL_PATTERN.match((value or "").strip()))


def _normalize_email_list(items) -> list[str]:
    out = []
    seen = set()
    for item in items or []:
        email = (item or "").strip().lower()
        if not email:
            continue
        if not _is_email(email):
            raise HTTPException(status_code=400, detail=f"Invalid email: {item}")
        if email in seen:
            continue
        out.append(email)
        seen.add(email)
    return out


def _smtp_public(smtp_cfg: dict) -> dict:
    return {
        "server": smtp_cfg.get("server", ""),
        "port": int(smtp_cfg.get("port", 465) or 465),
        "user": smtp_cfg.get("user", ""),
        "from_name": smtp_cfg.get("from_name", ""),
        "from_email": smtp_cfg.get("from_email", ""),
        "use_tls": bool(smtp_cfg.get("use_tls", False)),
        "use_ssl": bool(smtp_cfg.get("use_ssl", True)),
        "has_password": bool(smtp_cfg.get("password")),
    }


def _validate_smtp_ready(smtp_cfg: dict):
    missing = []
    if not smtp_cfg.get("server"):
        missing.append("server")
    if not smtp_cfg.get("user"):
        missing.append("user")
    if not smtp_cfg.get("password"):
        missing.append("password")
    if missing:
        raise HTTPException(status_code=400, detail=f"SMTP config incomplete: {', '.join(missing)}")


@router.get("/api/config/smtp")
def get_smtp_config():
    config = get_config()
    smtp_cfg = config.get("smtp", {})
    return {"smtp": _smtp_public(smtp_cfg)}


@router.post("/api/config/smtp")
def save_smtp_config(data: dict):
    payload = data or {}
    config = get_config()
    current = config.get("smtp", {})

    server = (payload.get("server") or "").strip()
    user = (payload.get("user") or "").strip()
    from_email = (payload.get("from_email") or user).strip()
    if from_email and not _is_email(from_email):
        raise HTTPException(status_code=400, detail="from_email must be a valid email address")

    next_cfg = {
        "server": server,
        "port": int(payload.get("port", current.get("port", 465)) or 465),
        "user": user,
        "from_name": (payload.get("from_name") or "").strip(),
        "from_email": from_email,
        "use_tls": bool(payload.get("use_tls", False)),
        "use_ssl": bool(payload.get("use_ssl", True)),
        "password": current.get("password", ""),
    }
    password = payload.get("password")
    if password is not None:
        next_cfg["password"] = str(password)

    config["smtp"] = next_cfg
    save_config(config)
    return {"status": "ok", "smtp": _smtp_public(next_cfg)}


@router.get("/api/sites/{site_id}/contacts")
def get_site_contacts(site_id: str):
    config = get_config()
    contacts = config.get("site_contacts", {})
    return {"site_id": site_id, "contacts": _normalize_email_list(contacts.get(site_id, []))}


@router.put("/api/sites/{site_id}/contacts")
def replace_site_contacts(site_id: str, data: dict):
    payload = data or {}
    contacts = _normalize_email_list(payload.get("contacts", []))

    config = get_config()
    all_contacts = config.setdefault("site_contacts", {})
    all_contacts[site_id] = contacts
    save_config(config)
    return {"status": "ok", "site_id": site_id, "contacts": contacts}


@router.post("/api/sites/{site_id}/contacts")
def add_site_contact(site_id: str, data: dict):
    payload = data or {}
    email = (payload.get("email") or "").strip().lower()
    if not _is_email(email):
        raise HTTPException(status_code=400, detail="Invalid email")

    config = get_config()
    all_contacts = config.setdefault("site_contacts", {})
    current = _normalize_email_list(all_contacts.get(site_id, []))
    if email not in current:
        current.append(email)
    all_contacts[site_id] = current
    save_config(config)
    return {"status": "ok", "site_id": site_id, "contacts": current}


@router.delete("/api/sites/{site_id}/contacts")
def remove_site_contact(site_id: str, email: str):
    email = (email or "").strip().lower()
    if not _is_email(email):
        raise HTTPException(status_code=400, detail="Invalid email")

    config = get_config()
    all_contacts = config.setdefault("site_contacts", {})
    current = _normalize_email_list(all_contacts.get(site_id, []))
    current = [item for item in current if item != email]
    all_contacts[site_id] = current
    save_config(config)
    return {"status": "ok", "site_id": site_id, "contacts": current}


@router.post("/api/email/send")
def send_email(data: dict):
    payload = data or {}
    site_id = (payload.get("site_id") or "").strip()
    if not site_id:
        raise HTTPException(status_code=400, detail="site_id is required")

    config = get_config()
    smtp_cfg = config.get("smtp", {})
    _validate_smtp_ready(smtp_cfg)

    site_contacts = _normalize_email_list(config.get("site_contacts", {}).get(site_id, []))
    mode = (payload.get("recipient_mode") or "selected_site_emails").strip()

    recipients = []
    if mode == "all_site_emails":
        recipients = site_contacts
    elif mode == "single_site_email":
        selected = (payload.get("single_email") or "").strip().lower()
        recipients = [selected] if selected else []
    elif mode == "selected_site_emails":
        recipients = _normalize_email_list(payload.get("selected_emails", []))
    elif mode == "manual_email":
        manual = payload.get("manual_emails", [])
        if isinstance(manual, str):
            manual = [item.strip() for item in manual.split(",") if item.strip()]
        recipients = _normalize_email_list(manual)
    else:
        raise HTTPException(status_code=400, detail="Invalid recipient_mode")

    if mode in {"single_site_email", "selected_site_emails"}:
        allowed = set(site_contacts)
        invalid = [email for email in recipients if email not in allowed]
        if invalid:
            raise HTTPException(status_code=400, detail=f"Emails not in site contact list: {', '.join(invalid)}")

    if not recipients:
        raise HTTPException(status_code=400, detail="No recipients resolved")

    subject = (payload.get("subject") or "").strip()
    html_body = (payload.get("html_body") or "").strip()
    text_body = (payload.get("text_body") or "").strip() or "Email generated from Netlify Ghost Hub"

    if not subject:
        raise HTTPException(status_code=400, detail="subject is required")
    if not html_body and not text_body:
        raise HTTPException(status_code=400, detail="html_body or text_body is required")

    from_email = (smtp_cfg.get("from_email") or smtp_cfg.get("user") or "").strip()
    from_name = (smtp_cfg.get("from_name") or "").strip()

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = f"{from_name} <{from_email}>" if from_name else from_email
    msg["To"] = ", ".join(recipients)
    msg.set_content(text_body)
    if html_body:
        msg.add_alternative(html_body, subtype="html")

    try:
        if smtp_cfg.get("use_ssl", True):
            with smtplib.SMTP_SSL(smtp_cfg["server"], int(smtp_cfg.get("port", 465)), timeout=20) as client:
                client.login(smtp_cfg["user"], smtp_cfg["password"])
                client.send_message(msg)
        else:
            with smtplib.SMTP(smtp_cfg["server"], int(smtp_cfg.get("port", 587)), timeout=20) as client:
                client.ehlo()
                if smtp_cfg.get("use_tls", True):
                    client.starttls()
                    client.ehlo()
                client.login(smtp_cfg["user"], smtp_cfg["password"])
                client.send_message(msg)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"SMTP send failed: {exc}") from exc

    return {
        "status": "sent",
        "site_id": site_id,
        "recipient_mode": mode,
        "recipient_count": len(recipients),
        "recipients": recipients,
    }
