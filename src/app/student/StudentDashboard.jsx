import DashboardScreen from "../../components/dashboard/DashboardScreen";

export default function StudentDashboard({ name, studentId }) {
  return (
    <DashboardScreen
      fixedRole="customer"
      fixedName={name}
      fixedStudentId={studentId}
    />
  );
}
