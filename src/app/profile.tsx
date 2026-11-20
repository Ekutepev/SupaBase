import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { supabase } from "../../lib/supabase";
import { useAuth } from "../context/AuthProvider";
import type { Colors } from "../theme/colors";
import { useTheme } from "../theme/ThemeProvider";

type ProfileData = {
  display_name: string;
  favourite_instrument: string | null;
};

export default function Profile() {
  const { colors } = useTheme();
  const styles = Styles(colors);

  const { session } = useAuth();
  const userId = session?.user.id;
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function getProfile() {
      const { data, error } = await supabase
        .from("profile")
        .select("display_name, favourite_instrument")
        .eq("id", userId)
        .single();

      if (cancelled) return;
      if (error) setError(error.message);
      else setProfile(data);
    }

    getProfile();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (error) return <Text style={styles.error}>Error: {error}</Text>;
  if (!profile) return <ActivityIndicator color={colors.primary} />;

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>PRIVATE</Text>
      <Text style={styles.label}>Display name</Text>
      <Text style={styles.value}>{profile.display_name}</Text>
      <Text style={styles.label}>Favourite instrument</Text>
      <Text style={styles.value}>
        {profile.favourite_instrument ?? "None yet"}
      </Text>
    </View>
  );
}

const Styles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      paddingHorizontal: 16,
      justifyContent: "flex-start",
      alignItems: "flex-start",
      padding: 16,
    },
    badge: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.danger,
    },
    label: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.muted,
      marginTop: 8,
    },
    value: {
      fontSize: 18,
      color: colors.text,
    },
    error: {
      fontSize: 13,
      color: colors.danger,
    },
  });
