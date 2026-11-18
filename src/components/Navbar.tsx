import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Colors } from "../theme/colors";
import { useTheme } from "../theme/ThemeProvider";

const Navbar = () => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const styles = Styles(colors);

    return (
        // insets.top is this phone's status bar / notch height
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
            <Text style={styles.title}>App name</Text>
        </View>
    )
};

const Styles = (colors: Colors) => StyleSheet.create({
    header: {
        backgroundColor: colors.surface,
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.text,
    }
})

export default Navbar;
