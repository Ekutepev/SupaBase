import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { z } from "zod";

import { useAuth } from "../context/AuthProvider";
import type { Colors } from "../theme/colors";
import { useTheme } from "../theme/ThemeProvider";

const signInSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const { colors } = useTheme();
  const { signIn } = useAuth();
  const styles = Styles(colors);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  // Only runs when the form passes Zod validation.
  async function onSubmit({ email, password }: SignInForm) {
    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);

      // AuthGuard handles navigation after a successful sign-in.
    } catch (error: any) {
      if (error.code === "invalid_credentials") {
        setError("Incorrect email or password.");
      } else if (error.code === "email_not_confirmed") {
        setError("Please confirm your email before signing in.");
      } else if (
        error.message?.toLowerCase().includes("fetch") ||
        error.message?.toLowerCase().includes("network")
      ) {
        setError("Network error. Check your internet connection.");
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="you@example.com"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Text style={styles.label}>Password</Text>
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Your password"
            placeholderTextColor={colors.muted}
            secureTextEntry
            editable={!loading}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <Pressable style={styles.button} onPress={() => handleSubmit(onSubmit)()} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <Text style={styles.buttonText}>Sign in</Text>
        )}
      </Pressable>

      <Link href="/sign-up" style={styles.link}>
        Don't have an account? Sign up
      </Link>
    </View>
  );
}

const Styles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 24,
      backgroundColor: colors.bg,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 24,
    },
    label: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.text,
      marginTop: 16,
      marginBottom: 6,
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 12,
      fontSize: 16,
      color: colors.text,
    },
    error: {
      fontSize: 13,
      color: colors.danger,
      marginTop: 4,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 14,
      alignItems: "center",
      marginTop: 24,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.onPrimary,
    },
    link: {
      fontSize: 13,
      color: colors.skyText,
      textAlign: "center",
      marginTop: 24,
    },
  });
