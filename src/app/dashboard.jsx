import { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function DashboardRoute() {
  const router = useRouter();
  const { role, name } = useLocalSearchParams();
  const normalizedRole = Array.isArray(role) ? role[0] : role;
  const normalizedName = Array.isArray(name) ? name[0] : name;
  const pathname = normalizedRole === "customer"
    ? "/student/dashboard"
    : "/store-owner/dashboard";

  useEffect(() => {
    router.replace({ pathname, params: { role: normalizedRole, name: normalizedName } });
  }, [router, pathname, normalizedRole, normalizedName]);

  return null;
}
