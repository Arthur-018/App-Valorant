import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "../hooks/useColors";

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 24) : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: topPad + 60, paddingBottom: bottomPad + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoArea}>
          <View style={[styles.logoBox, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoLetter}>V</Text>
          </View>
          <Text style={[styles.logoTitle, { color: colors.foreground }]}>VALORANT HUB</Text>
          <Text style={[styles.logoSub, { color: colors.textSecondary }]}>
            Sua base de dados não-oficial
          </Text>
        </View>

        <View style={styles.body}>
          <Text style={[styles.welcome, { color: colors.foreground }]}>
            Bem-vindo, agente
          </Text>
          <Text style={[styles.welcomeSub, { color: colors.textSecondary }]}>
            Explore agentes, armas e mapas. Sem login real, sem dados de jogador.
          </Text>

          <Pressable
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.replace("/home")}
          >
            <Feather name="log-in" size={18} color="#fff" />
            <Text style={styles.primaryBtnText}>Entrar</Text>
          </Pressable>

          <View style={[styles.notice, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="info" size={14} color={colors.textSecondary} />
            <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
              Login real com Riot Sign On (RSO) chegará em uma versão futura.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { paddingHorizontal: 24 },
  logoArea: { alignItems: "center", marginBottom: 56 },
  logoBox: {
    width: 80, height: 80, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
    marginBottom: 18,
    shadowColor: "#FF4655",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  logoLetter: { fontSize: 40, fontFamily: "Inter_700Bold", color: "#fff" },
  logoTitle: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: 4 },
  logoSub: { fontSize: 13, fontFamily: "Inter_400Regular", letterSpacing: 1, marginTop: 6 },
  body: { gap: 12 },
  welcome: { fontSize: 22, fontFamily: "Inter_700Bold", textAlign: "center" },
  welcomeSub: {
    fontSize: 14, fontFamily: "Inter_400Regular",
    textAlign: "center", lineHeight: 20, marginBottom: 24,
  },
  primaryBtn: {
    height: 54, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
    flexDirection: "row", gap: 8,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  notice: {
    flexDirection: "row", alignItems: "center", gap: 10,
    borderRadius: 12, borderWidth: 1, padding: 12,
    marginTop: 20,
  },
  noticeText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
});
