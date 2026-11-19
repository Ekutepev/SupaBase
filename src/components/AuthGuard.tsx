import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

import { useAuth } from "../context/AuthProvider";

export default function AuthGuard() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Wait until the saved session has been checked.
    if (isLoading) return;

    const currentRoute = segments[0];

    const isAuthPage =
      currentRoute === "sign-in" ||
      currentRoute === "sign-up";

    // Redirect users who have not signed in.
    if (!session && !isAuthPage) {
      router.replace("/sign-in");
    }

    // Signed-in users should go to the protected home page.
    if (session && isAuthPage) {
      router.replace("/");
    }
  }, [session, isLoading, segments, router]);

  return null;
}
