import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import type { Colors } from "../theme/colors";
import { useTheme } from "../theme/ThemeProvider";

const Navbar = () => {
    const { colors } = useTheme();
    const { user, signOut } = useAuth();
    const insets = useSafeAreaInsets();
    const styles = Styles(colors);

    const [loading, setLoading] = useState(false);

    // Sign out the current user through AuthContext.
    async function handleSignOut() {
        setLoading(true);

        try {
            await signOut();

            // AuthGuard handles navigation after signing out.
        } catch {
            Alert.alert("Error", "Unable to sign out. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        // insets.top is this phone's status bar / notch height
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
            <View style={styles.headerContent}>
                <View style={styles.userInfo}>
                    <Text style={styles.title}>CaddyUp</Text>
                    <Text style={styles.email} numberOfLines={1}>
                        {user?.email}
                    </Text>
                </View>

                <Pressable
                    style={styles.signOutButton}
                    onPress={handleSignOut}
                    disabled={loading}
                >
                    <Text style={styles.signOutText}>
                        {loading ? "Signing out..." : "Sign out"}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

const Styles = (colors: Colors) => StyleSheet.create({
    header: {
        backgroundColor: colors.surface,
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    userInfo: {
        flex: 1,
        marginRight: 12,
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.text,
    },

    email: {
        fontSize: 12,
        color: colors.muted,
        marginTop: 4,
    },

    signOutButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
    },

    signOutText: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.onPrimary,
    },
});

export default Navbar;