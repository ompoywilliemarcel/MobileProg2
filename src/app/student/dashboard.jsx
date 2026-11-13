import { useLocalSearchParams } from "expo-router";
import StudentDashboard from "./StudentDashboard";

export default function StudentDashboardRoute() {
  const { name } = useLocalSearchParams();
  return <StudentDashboard name={Array.isArray(name) ? name[0] : name} />;
}
