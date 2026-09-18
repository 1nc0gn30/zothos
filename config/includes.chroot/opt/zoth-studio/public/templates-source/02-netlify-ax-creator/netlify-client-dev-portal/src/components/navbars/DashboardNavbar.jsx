import { useEffect, useRef, useState } from 'react'
import {
  HelpCircle,
  UserCircle,
  Settings,
  LogOut,
  LayoutDashboard,
  Code2,
  Users,
  Shield,
} from 'lucide-react'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ROLE_LABELS = {
  client: 'Client',
  developer: 'Developer',
}

export default function DashboardNavbar({ role }) {
  const roleLabel = ROLE_LABELS[role] || 'Netlify User'
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const { signOut } = useAuth()

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async () => {
    setOpen(false)
    await signOut()
    navigate('/')
  }

  return (
    <nav className="dashboard-nav">
      <div className="dashboard-brand">
        <Link to="/">
          <img
            src="https://www.netlify.com/v3/img/components/logomark.svg"
            alt="Netlify"
            className="dashboard-logo"
          />
        </Link>
        <span className={`role-pill role-${role}`}>{roleLabel}</span>
      </div>

      <div className="dashboard-nav-icons" ref={menuRef}>
        <HelpCircle size={22} />

        <button
          className="nav-avatar-btn"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <UserCircle size={26} />
        </button>

        {open && (
          <div className="nav-dropdown">
            {role === 'client' && (
              <>
                <DropdownItem icon={<LayoutDashboard size={16} />} label="My Dashboard" />
                <DropdownItem icon={<Users size={16} />} label="Team Access" />
                <DropdownItem icon={<Settings size={16} />} label="Account Settings" />
              </>
            )}

            {role === 'developer' && (
              <>
                <DropdownItem icon={<Code2 size={16} />} label="Developer Console" />
                <DropdownItem icon={<Shield size={16} />} label="Security Logs" />
                <DropdownItem icon={<Settings size={16} />} label="Environment Settings" />
              </>
            )}

            <div className="dropdown-divider" />

            <DropdownItem
              icon={<LogOut size={16} />}
              label="Sign Out"
              danger
              onClick={handleSignOut}
            />
          </div>
        )}
      </div>
    </nav>
  )
}

function DropdownItem({ icon, label, danger, onClick }) {
  return (
    <button className={`dropdown-item ${danger ? 'danger' : ''}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  )
}

DropdownItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  danger: PropTypes.bool,
  onClick: PropTypes.func,
}

DashboardNavbar.propTypes = {
  role: PropTypes.oneOf(['client', 'developer']).isRequired,
}
