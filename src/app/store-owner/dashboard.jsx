import { useLocalSearchParams } from "expo-router";
import StoreOwnerDashboard from "./StoreOwnerDashboard";

export default function StoreOwnerDashboardRoute() {
  const { name, role } = useLocalSearchParams();
  const normalizedRole = Array.isArray(role) ? role[0] : role;
  return (
    <StoreOwnerDashboard
      name={Array.isArray(name) ? name[0] : name}
      role={normalizedRole === "admin" ? "admin" : "user"}
    />
  );
}
