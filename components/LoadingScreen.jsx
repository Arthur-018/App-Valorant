import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useColors } from "../hooks/useColors";

export function LoadingScreen({ message = "Carregando..." }) {
  const colors = useColors();
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.text, { color: colors.textSecondary }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14 },
  text: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
