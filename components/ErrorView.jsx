import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "../hooks/useColors";

export function ErrorView({ message = "Algo deu errado", onRetry }) {
  const colors = useColors();
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Feather name="alert-triangle" size={42} color={colors.primary} />
      <Text style={[styles.text, { color: colors.foreground }]}>{message}</Text>
      {onRetry ? (
        <Pressable
          style={[styles.btn, { backgroundColor: colors.primary }]}
          onPress={onRetry}
        >
          <Feather name="refresh-cw" size={16} color="#fff" />
          <Text style={styles.btnText}>Tentar novamente</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, padding: 24 },
  text: { fontSize: 15, fontFamily: "Inter_500Medium", textAlign: "center" },
  btn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10,
  },
  btnText: { color: "#fff", fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
