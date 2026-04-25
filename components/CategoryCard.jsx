import { Feather } from "@expo/vector-icons";
import { useRef } from "react";
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "../hooks/useColors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

export function CategoryCard({ title, subtitle, icon, color, onPress }) {
  const colors = useColors();
  const opacity = useRef(new Animated.Value(1)).current;

  function onPressIn() {
    Animated.timing(opacity, { toValue: 0.7, duration: 100, useNativeDriver: true }).start();
  }
  function onPressOut() {
    Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();
  }

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[styles.card, { backgroundColor: colors.card, opacity }]}>
        <View style={[styles.colorAccent, { backgroundColor: color }]} />
        <View style={styles.overlay} />
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: color + "22" }]}>
            <Feather name={icon} size={22} color={color} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    minWidth: 140,
    height: 140,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
    position: "relative",
  },
  colorAccent: { position: "absolute", top: 0, left: 0, width: 4, height: "100%" },
  overlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(15,25,35,0.4)",
  },
  content: { flex: 1, padding: 14, justifyContent: "flex-end" },
  iconContainer: {
    width: 42, height: 42, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
    marginBottom: 10,
  },
  title: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 2 },
  subtitle: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
