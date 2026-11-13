import DashboardScreen from "../../components/dashboard/DashboardScreen";

export default function StudentDashboard({ name }) {
  return <DashboardScreen fixedRole="customer" fixedName={name} />;
}
