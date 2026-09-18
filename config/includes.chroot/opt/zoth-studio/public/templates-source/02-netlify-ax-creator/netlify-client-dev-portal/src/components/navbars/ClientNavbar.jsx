import DashboardNavbar from './DashboardNavbar';
import { useAuth } from '../../context/AuthContext';

export default function ClientNavbar() {
  const { role } = useAuth();

  if (role !== 'client') return null;

  return <DashboardNavbar role="client" />;
}
