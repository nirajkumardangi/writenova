import { useAuthStore } from "./store";

export function useCurrentUser() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  return { user, loading };
}
