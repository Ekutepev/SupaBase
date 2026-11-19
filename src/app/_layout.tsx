import { Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AuthGuard from "../components/AuthGuard";
import { AuthProvider, useAuth } from "../context/AuthProvider";
import { ThemeProvider, useTheme } from "../theme/ThemeProvider";

// Like Next.js's app/layout.tsx: wraps every screen in the app.
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppNavigation />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AppNavigation() {
  const { session, isLoading } = useAuth();
  const { colors } = useTheme();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!session}>
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="sign-up" />
        </Stack.Protected>

        <Stack.Protected guard={!!session}>
          <Stack.Screen name="index" />
        </Stack.Protected>
      </Stack>

      {isLoading && (
        <View style={[styles.loadingOverlay, { backgroundColor: colors.bg }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      <AuthGuard />
    </>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
  },
});
