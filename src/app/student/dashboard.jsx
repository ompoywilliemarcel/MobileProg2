import { useLocalSearchParams } from "expo-router";
import StudentDashboard from "./StudentDashboard";

export default function StudentDashboardRoute() {
  const { name, id } = useLocalSearchParams();
  return (
    <StudentDashboard
      name={Array.isArray(name) ? name[0] : name}
      studentId={Array.isArray(id) ? id[0] : id}
    />
  );
}
