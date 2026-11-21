import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import { supabase } from "../../lib/supabase";
import type { Colors } from "../theme/colors";
import { useTheme } from "../theme/ThemeProvider";

type profile = {
  id: string;
  email: string;
};

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ProfileList />
    </View>
  );
}

function ProfileList() {
  const { colors, isDark } = useTheme();
  const styles = Styles(colors);

  const [profiles, setProfiles] = useState<profile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfiles();
  }, []);

  // Get the profiles from Supabase.
  async function getProfiles() {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("profile")
        .select();

      if (error) {
        setError(error.message);
        return;
      }

      setProfiles(data ?? []);
    } catch {
      setError("Unable to load profiles.");
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error loading profile: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? "light" : "dark"} />
      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Text style={styles.item}>{item.email}</Text>
          )}
          ListEmptyComponent={
            <Text style={styles.item}>
              No profiles available.
            </Text>
          }
        />
      )}
    </View>
  );
}

const Styles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      paddingHorizontal: 16,
    },
    item: {
      padding: 16,
      color: colors.text,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    error: {
      color: colors.danger,
    },
  });
