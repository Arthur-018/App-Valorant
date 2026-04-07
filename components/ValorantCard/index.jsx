import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export function ValorantCard({ title, image, subtitle, onPress }) {
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
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {!!subtitle && (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
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
  },
  hover: {
    opacity: 0.8,
  },
  pressed: {
    opacity: 0.65,
  },
  image: {
    width: "100%",
    height: 150,
  },
  content: {
    padding: 12,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: "#c9c9c9",
    fontSize: 13,
  },
});