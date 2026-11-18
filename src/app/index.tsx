import { Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import { supabase } from "../../lib/supabase";
import Navbar from "../components/Navbar";
import type { Colors } from "../theme/colors";
import { useTheme } from "../theme/ThemeProvider";

type Instrument = {
  id: number;
  name: string;
};

export default function HomeScreen() {
  const [checking, setChecking] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  // On launch, look for a saved Supabase session.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(data.session !== null);
      setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!signedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Navbar />
      <InstrumentList />
    </View>
  );
}

function InstrumentList() {
  const { colors, isDark } = useTheme();
  const styles = Styles(colors);

  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getInstruments();
  }, []);

  async function getInstruments() {
    const { data, error } = await supabase.from("instruments").select();

    if (error) {
      setError(error.message);
      return;
    }

    setInstruments(data ?? []);
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error loading instruments: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <FlatList
        data={instruments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
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
