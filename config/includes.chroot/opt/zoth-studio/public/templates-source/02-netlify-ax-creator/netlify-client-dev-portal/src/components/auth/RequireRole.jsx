import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';

export default function RequireRole({ role, children }) {
  const { user, role: currentRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="full-screen-loader">
        <div className="spinner" />
        <p>Checking your access…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (currentRole !== role) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}

RequireRole.propTypes = {
  role: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
