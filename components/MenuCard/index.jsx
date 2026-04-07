import { Pressable, StyleSheet, Text } from "react-native";

export function MenuCard({ title, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.card,
        hovered && styles.hover,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    minHeight: 120,
    borderRadius: 16,
    backgroundColor: "#1f1f1f",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  hover: {
    opacity: 0.85,
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});