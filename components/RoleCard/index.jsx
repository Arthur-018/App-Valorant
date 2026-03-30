import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export function RoleCard({ title, image, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.card,
        hovered && styles.hover,
        pressed && styles.pressed,
      ]}
    >
      {!!image && (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1f1f1f",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    minHeight: 200,
  },
  hover: {
    opacity: 0.85,
  },
  pressed: {
    opacity: 0.7,
  },
  image: {
    width: "100%",
    height: 140,
    marginTop: 12,
  },
  content: {
    padding: 12,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});