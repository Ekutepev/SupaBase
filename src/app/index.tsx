import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { supabase } from "../../lib/supabase";
import Navbar from "../components/Navbar";
import type { Colors } from "../theme/colors";
import { useTheme } from "../theme/ThemeProvider";

type Instrument = {
  id: number;
  name: string;
};

type profile = {
  id: string;
  email: string;
};

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Navbar />
      <ProfileList />
    </View>
  );
}

function ProfileList() {
  const { colors, isDark } = useTheme();
  const styles = Styles(colors);

  const [profiles, setProfiles] = useState<profile[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProfiles();
  }, []);

  // Get the instruments from Supabase.
  async function getProfiles() {
    const { data, error } = await supabase.from("profile").select();

    if (error) {
      setError(error.message);
      return;
    }

    setProfiles(data ?? []);
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
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item.email}</Text>}
      />
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
