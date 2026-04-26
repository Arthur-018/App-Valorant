import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ErrorView } from "../components/ErrorView";
import { LoadingScreen } from "../components/LoadingScreen";
import { useColors } from "../hooks/useColors";

export default function GameModesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [modes, setModes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("https://valorant-api.com/v1/gamemodes?language=pt-BR");
      const json = await res.json();
      const list = (json.data || [])
        .filter((g) => g.displayName && g.description)
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
      setModes(list);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 12) : insets.top;

  if (loading) return <LoadingScreen message="Carregando modos de jogo..." />;
  if (error) return <ErrorView onRetry={load} />;

  const renderMode = ({ item }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.iconWrap}>
        {item.displayIcon ? (
          <Image source={{ uri: item.displayIcon }} style={styles.icon} resizeMode="contain" />
        ) : (
          <View style={[styles.icon, { backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }]}>
            <Feather name="play-circle" size={22} color={colors.textSecondary} />
          </View>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: colors.foreground }]}>{item.displayName}</Text>
        <Text style={[styles.desc, { color: colors.textSecondary }]} numberOfLines={4}>
          {item.description}
        </Text>
        <View style={styles.metaRow}>
          {item.duration ? (
            <View style={[styles.metaChip, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Feather name="clock" size={11} color={colors.primary} />
              <Text style={[styles.metaText, { color: colors.foreground }]}>{item.duration}</Text>
            </View>
          ) : null}
          {item.economyType && !item.economyType.includes("::") ? (
            <View style={[styles.metaChip, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Feather name="trending-up" size={11} color={colors.primary} />
              <Text style={[styles.metaText, { color: colors.foreground }]}>{item.economyType}</Text>
            </View>
          ) : null}
          {item.allowsMatchTimeouts ? (
            <View style={[styles.metaChip, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Feather name="pause" size={11} color={colors.primary} />
              <Text style={[styles.metaText, { color: colors.foreground }]}>Pausas</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Modos de Jogo</Text>
        <View style={{ width: 38 }} />
      </View>

      <FlatList
        data={modes}
        keyExtractor={(g) => g.uuid}
        renderItem={renderMode}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 10 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ color: colors.textSecondary, textAlign: "center", marginTop: 24 }}>
            Nenhum modo disponível
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  card: {
    flexDirection: "row",
    gap: 14,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconWrap: { width: 56, height: 56, alignItems: "center", justifyContent: "center" },
  icon: { width: 56, height: 56, borderRadius: 10 },
  title: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 4 },
  desc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  metaText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
});
