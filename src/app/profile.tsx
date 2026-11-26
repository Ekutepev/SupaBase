import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

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
  // Keep edits local until Save is pressed.
  const [saveError, setSaveError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [favouriteInstrument, setFavouriteInstrument] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function getProfile() {
      const { data, error } = await supabase
        .from("profile")
        .select("display_name, favourite_instrument")
        .eq("id", userId)
        .maybeSingle();

      if (cancelled) return;
      if (error) {
        setError(error.message);
      } else if (!data) {
        setError("No profile found for this account.");
      } else {
        setProfile(data);
        setDisplayName(data.display_name);
        setFavouriteInstrument(data.favourite_instrument ?? "");
      }
    }

    // Wait for the authenticated user's ID before querying their profile.
    if (userId) {
      getProfile();
    }
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // RLS enforces ownership; this filter targets the current user's row.
  async function saveProfile() {
    if (!userId) {
      setSaveError("Sign in to update your profile.");
      return;
    }

    const trimmedDisplayName = displayName.trim();
    if (!trimmedDisplayName) {
      setSaveError("Display name cannot be empty.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const { data, error } = await supabase
        .from("profile")
        .update({
          display_name: trimmedDisplayName,
          favourite_instrument: favouriteInstrument.trim() || null,
        })
        .eq("id", userId)
        .select("display_name, favourite_instrument")
        .single();

      if (error) {
        setSaveError(error.message);
      } else {
        setProfile(data);
        setDisplayName(data.display_name);
        setFavouriteInstrument(data.favourite_instrument ?? "");
      }
    } catch (cause) {
      setSaveError(
        cause instanceof Error
          ? cause.message
          : "An unexpected error occurred while saving your profile.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>PRIVATE</Text>
      <Text style={styles.label}>Display name</Text>
      <TextInput
        accessibilityLabel="Display name"
        autoCapitalize="words"
        editable={!isSaving}
        onChangeText={setDisplayName}
        style={styles.input}
        value={displayName}
      />
      <Text style={styles.label}>Favourite instrument</Text>
      <TextInput
        accessibilityLabel="Favourite instrument"
        autoCapitalize="words"
        editable={!isSaving}
        onChangeText={setFavouriteInstrument}
        placeholder="None"
        placeholderTextColor={colors.muted}
        style={styles.input}
        value={favouriteInstrument}
      />
      {saveError && <Text style={styles.error}>{saveError}</Text>}
      <Pressable
        accessibilityRole="button"
        disabled={isSaving}
        onPress={saveProfile}
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
      >
        <Text style={styles.saveButtonText}>
          {isSaving ? "Saving..." : "Save profile"}
        </Text>
      </Pressable>
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
    error: {
      fontSize: 13,
      color: colors.danger,
      marginTop: 12,
    },
    input: {
      width: "100%",
      minHeight: 44,
      borderWidth: 1,
      borderColor: colors.muted,
      borderRadius: 8,
      color: colors.text,
      fontSize: 16,
      paddingHorizontal: 12,
    },
    saveButton: {
      alignItems: "center",
      backgroundColor: colors.primary,
      borderRadius: 8,
      marginTop: 20,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
      color: colors.bg,
      fontSize: 16,
      fontWeight: "600",
    },
  });
