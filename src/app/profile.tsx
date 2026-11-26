import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

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
  const [name, setName] = useState("");
  const [instrument, setInstrument] = useState("");
  const [save, setSave] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = () => {
    if (!profile) return;
    setName(profile.display_name ?? "");
    setInstrument(profile.favourite_instrument ?? "");
    setSaveError(null);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!userId) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      setSaveError("Display name can't be empty.");
      return;
    }

    setSave(true);
    setSaveError(null);

    const { data, error } = await supabase
      .from("profile")
      .update({
        display_name: trimmedName,
        favourite_instrument: instrument.trim() || null,
      })
      .eq("id", userId)
      .select("display_name, favourite_instrument")
      .single();

    setSave(false);

    if (error) {
      setSaveError(error.message);
      return;
    }

    setProfile(data);
    setIsEditing(false);
  };

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
      }
    }

    if (userId) {
      getProfile();
    }
    return () => {
      cancelled = true;
    };
  }, [userId]);

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
      {!isEditing ? (
        <Text style={styles.value}>{profile.display_name}</Text>
      ) : (
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          editable={!save}
        />
      )}

      <Text style={styles.label}>Favourite instrument</Text>
      {!isEditing ? (
        <Text style={styles.value}>
          {profile.favourite_instrument ?? "none yet"}
        </Text>
      ) : (
        <TextInput
          style={styles.input}
          value={instrument}
          onChangeText={setInstrument}
          editable={!save}
        />
      )}

      {saveError && <Text style={styles.error}>{saveError}</Text>}

      {!isEditing ? (
        <Pressable onPress={handleEdit}>
          <Text style={styles.action}>Edit</Text>
        </Pressable>
      ) : (
        <>
          <Pressable onPress={handleSave} disabled={save}>
            <Text style={styles.action}>{save ? "Saving..." : "Save"}</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setSaveError(null);
              setIsEditing(false);
            }}
            disabled={save}
          >
            <Text style={styles.action}>Cancel</Text>
          </Pressable>
        </>
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
    input: {
      alignSelf: "stretch",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 12,
      fontSize: 16,
      color: colors.text,
    },
    action: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.skyText,
      marginTop: 16,
    },
  });
