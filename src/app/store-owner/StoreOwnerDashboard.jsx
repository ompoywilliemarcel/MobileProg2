import DashboardScreen from "../../components/dashboard/DashboardScreen";

export default function StoreOwnerDashboard({ name, role = "user" }) {
  return <DashboardScreen fixedRole={role} fixedName={name} />;
}
