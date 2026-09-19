import os

CONFIG = {
    "HEXSTRIKE_URL": os.environ.get("HEXSTRIKE_URL", "http://127.0.0.1:8000/api"),
    "LOCALAI_URL": os.environ.get("LOCALAI_URL", "http://127.0.0.1:8090/v1"),
    "OLLAMA_URL": os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434"),
    "LLAMACPP_URL": os.environ.get("LLAMACPP_URL", "http://127.0.0.1:8080/v1"),
    "LITELLM_URL": os.environ.get("LITELLM_URL", "http://127.0.0.1:4000/v1"),
    "MODEL_NAME": os.environ.get("HEXSTRIKE_MODEL", "qwen2.5-coder:latest"),
    "FALLBACK_MODELS": [
        "qwen2.5-coder:latest",
        "deepseek-coder:latest",
        "llama3:latest",
        "mistral:latest",
        "codellama:latest",
        "gpt-4"
    ],
    "OFFLINE_MODE": os.environ.get("ZOTH_OFFLINE", "1").lower() in ("1", "true", "yes"),
    "TIMEOUT": 300,
}