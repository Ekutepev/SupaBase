import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { z } from "zod";

import { supabase } from "../../lib/supabase";
import { useAuth } from "../context/AuthContext";
import type { Colors } from "../theme/colors";
import { useTheme } from "../theme/ThemeProvider";

const signUpSchema = z
  .object({
    email: z.email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const { colors } = useTheme();
  const { signUp } = useAuth();
  const styles = Styles(colors);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  // Only runs when the form passes the Zod schema.
  async function onSubmit({ email, password }: SignUpForm) {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const hasSession = await signUp(email, password);

      // If email confirmation is enabled, the user must confirm first.
      if (!hasSession) {
        setMessage("Check your email for a confirmation link, then sign in.");
      }

      // AuthGuard handles navigation if the user has a session.
    } catch {
      setError("Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>

      {error && <Text style={styles.error}>{error}</Text>}
      {message && <Text style={styles.message}>{message}</Text>}

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
            placeholder="At least 8 characters"
            placeholderTextColor={colors.muted}
            secureTextEntry
            editable={!loading}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <Text style={styles.label}>Confirm password</Text>
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Re-enter your password"
            placeholderTextColor={colors.muted}
            secureTextEntry
            editable={!loading}
          />
        )}
      />
      {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}

      <Pressable style={styles.button} onPress={() => handleSubmit(onSubmit)()} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <Text style={styles.buttonText}>Sign up</Text>
        )}
      </Pressable>

      <Link href="/sign-in" style={styles.link}>
        Already have an account? Sign in
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
    message: {
      fontSize: 13,
      color: colors.skyText,
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
