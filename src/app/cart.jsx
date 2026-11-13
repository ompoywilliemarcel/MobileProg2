import { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function CartRoute() {
  const router = useRouter();
  const { name } = useLocalSearchParams();
  const normalizedName = Array.isArray(name) ? name[0] : name;

  useEffect(() => {
    router.replace({ pathname: "/student/cart", params: { name: normalizedName } });
  }, [router, normalizedName]);

  return null;
}
