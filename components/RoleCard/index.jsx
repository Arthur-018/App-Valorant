import { StyleSheet } from "react-native";
import { Text } from "react-native";
import { Pressable } from "react-native";

export function RoleCard({ title, active, onPress }) {
    <Pressable
     onPress={onPress}
     style={({ hovered, pressed}) => [
        styles.card,
        active && styles.activeCard,
        hovered && styles.hover,
        pressed && styles.pressed,
     ]}
    >
     <Text style={[styles.text, active && styles.activeText]}>
        {title}
     </Text>
    </Pressable>
}

const styles = StyleSheet.create({
    card: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        backgroundColor: "#1f1f1f",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
    },
    activeCard: {
        backgroundColor: "#ff46555",
    },
    hover: {
        opacity: 0.85,
    },
    pressed:{
        opacity: 0.7,
    },
    text: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "600",
    },
    activeText: {
        color: "#FFF"
    }
})