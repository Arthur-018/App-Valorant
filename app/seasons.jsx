import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ErrorView } from "../components/ErrorView";
import { LoadingScreen } from "../components/LoadingScreen";
import { useColors } from "../hooks/useColors";

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function isOngoing(season) {
  const now = Date.now();
  const start = new Date(season.startTime).getTime();
  const end = new Date(season.endTime).getTime();
  return now >= start && now <= end;
}

export default function SeasonsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [allSeasons, setAllSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("https://valorant-api.com/v1/seasons?language=pt-BR");
      const json = await res.json();
      setAllSeasons(json.data || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const episodes = useMemo(() => {
    const eps = allSeasons.filter((s) => !s.parentUuid);
    eps.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    if (!search.trim()) return eps;
    const q = search.trim().toLowerCase();
    return eps.filter((e) => e.displayName.toLowerCase().includes(q));
  }, [allSeasons, search]);

  const actsByParent = useMemo(() => {
    const map = {};
    for (const s of allSeasons) {
      if (s.parentUuid) {
        if (!map[s.parentUuid]) map[s.parentUuid] = [];
        map[s.parentUuid].push(s);
      }
    }
    return map;
  }, [allSeasons]);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 12) : insets.top;

  if (loading) return <LoadingScreen message="Carregando temporadas..." />;
  if (error) return <ErrorView onRetry={load} />;

  const renderItem = ({ item }) => {
    const acts = actsByParent[item.uuid] || [];
    const ongoing = isOngoing(item);
    return (
      <Pressable
        onPress={() =>
          router.push({ pathname: "/season-detail", params: { uuid: item.uuid } })
        }
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: ongoing ? colors.primary : colors.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]} numberOfLines={1}>
              {item.displayName}
            </Text>
            <View style={styles.metaRow}>
              <Feather name="calendar" size={12} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {formatDate(item.startTime)} — {formatDate(item.endTime)}
              </Text>
            </View>
          </View>
          {ongoing ? (
            <View style={[styles.liveTag, { backgroundColor: colors.primary }]}>
              <Text style={styles.liveTagText}>EM ANDAMENTO</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.cardFooter}>
          <View style={[styles.actsBadge, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Feather name="layers" size={12} color={colors.textSecondary} />
            <Text style={[styles.actsBadgeText, { color: colors.textSecondary }]}>
              {acts.length} {acts.length === 1 ? "ato" : "atos"}
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color={colors.textSecondary} />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <View style={styles.headerBar}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.card }]}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Temporadas</Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={styles.searchWrap}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.textSecondary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar temporada..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.foreground, ...(Platform.OS === "web" ? { outlineStyle: "none" } : {}) }]}
          />
          {search ? (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.textSecondary} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <FlatList
        data={episodes}
        keyExtractor={(it) => it.uuid}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 12 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ color: colors.textSecondary, textAlign: "center", marginTop: 32 }}>
            Nenhuma temporada encontrada
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
  searchWrap: { paddingHorizontal: 16, paddingBottom: 12 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", padding: 0 },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  cardTitle: { fontSize: 17, fontFamily: "Inter_700Bold", marginBottom: 6 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  liveTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  liveTagText: { color: "#fff", fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  actsBadgeText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
});
