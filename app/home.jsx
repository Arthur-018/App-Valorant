import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CategoryCard } from "../components/CategoryCard";
import { useColors } from "../hooks/useColors";

const CATEGORIES = [
  { id: "agents",  title: "Agentes", subtitle: "Conheça os lutadores", icon: "shield",     color: "#FF4655", path: "/agents" },
  { id: "weapons", title: "Armas",   subtitle: "Arsenal completo",     icon: "crosshair",  color: "#00C4B4", path: "/weapons" },
  { id: "maps",    title: "Mapas",   subtitle: "Cenários do jogo",     icon: "map",        color: "#7B5BD2", path: "/maps" },
  { id: "banners", title: "Banners", subtitle: "Cartões de jogador",   icon: "image",      color: "#56B847", path: "/banners" },
  { id: "sprays",  title: "Sprays",  subtitle: "Adesivos no cenário",  icon: "droplet",    color: "#E91E63", path: "/sprays" },
  { id: "titles",  title: "Títulos", subtitle: "Frases de exibição",   icon: "award",      color: "#F5A623", path: "/titles" },
  { id: "seasons", title: "Temporadas", subtitle: "Episódios e atos",  icon: "calendar",   color: "#9B59B6", path: "/seasons" },
  { id: "profile", title: "Perfil",  subtitle: "Sua conta",            icon: "user",       color: "#3498DB", path: "/profile" },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 24) : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const left = CATEGORIES.filter((_, i) => i % 2 === 0);
  const right = CATEGORIES.filter((_, i) => i % 2 !== 0);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPad + 16, paddingBottom: bottomPad + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Bem-vindo,</Text>
            <Text style={[styles.username, { color: colors.foreground }]}>Agente</Text>
          </View>
          <Pressable
            style={[styles.logoutBtn, { backgroundColor: colors.card }]}
            onPress={() => router.replace("/login")}
          >
            <Feather name="log-out" size={18} color={colors.textSecondary} />
          </Pressable>
        </View>

        <View style={[styles.banner, { backgroundColor: colors.primary }]}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>VALORANT HUB</Text>
            <Text style={styles.bannerSub}>Base de dados não-oficial</Text>
          </View>
          <View style={styles.bannerDecor}>
            <View style={styles.decCircle1} />
            <View style={styles.decCircle2} />
          </View>
          <Feather
            name="shield"
            size={48}
            color="rgba(255,255,255,0.15)"
            style={styles.bannerIcon}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Categorias</Text>

        <View style={styles.grid}>
          <View style={styles.col}>
            {left.map((c) => (
              <CategoryCard
                key={c.id}
                title={c.title}
                subtitle={c.subtitle}
                icon={c.icon}
                color={c.color}
                onPress={() => router.push(c.path)}
              />
            ))}
          </View>
          <View style={styles.col}>
            {right.map((c) => (
              <CategoryCard
                key={c.id}
                title={c.title}
                subtitle={c.subtitle}
                icon={c.icon}
                color={c.color}
                onPress={() => router.push(c.path)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  greeting: { fontSize: 13, fontFamily: "Inter_400Regular" },
  username: { fontSize: 22, fontFamily: "Inter_700Bold" },
  logoutBtn: {
    width: 40, height: 40, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
  },
  banner: {
    borderRadius: 16, padding: 24, marginBottom: 28,
    overflow: "hidden", position: "relative",
  },
  bannerContent: { zIndex: 2 },
  bannerTitle: {
    fontSize: 26, fontFamily: "Inter_700Bold",
    color: "#fff", letterSpacing: 4,
  },
  bannerSub: {
    fontSize: 13, fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.7)", marginTop: 4,
  },
  bannerDecor: { position: "absolute", top: -20, right: -20 },
  decCircle1: { width: 100, height: 100, borderRadius: 50, backgroundColor: "rgba(255,255,255,0.1)" },
  decCircle2: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginTop: -40, marginLeft: 20,
  },
  bannerIcon: { position: "absolute", bottom: -4, right: 24 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 16 },
  grid: { flexDirection: "row", gap: 12 },
  col: { flex: 1 },
});
