import DashboardNavbar from './DashboardNavbar';
import { useAuth } from '../../context/AuthContext';

export default function DeveloperNavbar() {
  const { role } = useAuth();

  if (role !== 'developer') return null;

  return <DashboardNavbar role="developer" />;
}
