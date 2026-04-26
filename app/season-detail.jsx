import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
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

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function isOngoing(s) {
  const now = Date.now();
  return now >= new Date(s.startTime).getTime() && now <= new Date(s.endTime).getTime();
}

function durationDays(s) {
  const ms = new Date(s.endTime).getTime() - new Date(s.startTime).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export default function SeasonDetailScreen() {
  const { uuid } = useLocalSearchParams();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [allSeasons, setAllSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    if (!uuid) return;
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

  useEffect(() => { load(); }, [uuid]);

  const episode = useMemo(
    () => allSeasons.find((s) => s.uuid === uuid),
    [allSeasons, uuid],
  );

  const acts = useMemo(() => {
    const list = allSeasons.filter((s) => s.parentUuid === uuid);
    list.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    return list;
  }, [allSeasons, uuid]);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 12) : insets.top;

  if (loading) return <LoadingScreen message="Carregando atos..." />;
  if (error) return <ErrorView onRetry={load} />;
  if (!episode) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <View style={styles.headerBar}>
          <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Temporada</Text>
          <View style={{ width: 38 }} />
        </View>
        <Text style={{ color: colors.textSecondary, textAlign: "center", marginTop: 40 }}>
          Temporada não encontrada
        </Text>
      </View>
    );
  }

  const renderAct = ({ item, index }) => {
    const ongoing = isOngoing(item);
    return (
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/act-detail",
            params: { uuid: item.uuid, episodeName: episode.displayName },
          })
        }
        style={({ pressed }) => [
          styles.actCard,
          {
            backgroundColor: colors.card,
            borderColor: ongoing ? colors.primary : colors.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <View style={[styles.actIndex, { backgroundColor: ongoing ? colors.primary : colors.background, borderColor: colors.border }]}>
          <Text style={[styles.actIndexText, { color: ongoing ? "#fff" : colors.foreground }]}>
            {index + 1}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.actTitleRow}>
            <Text style={[styles.actTitle, { color: colors.foreground }]} numberOfLines={1}>
              {item.displayName}
            </Text>
            {ongoing ? (
              <View style={[styles.liveTag, { backgroundColor: colors.primary }]}>
                <Text style={styles.liveTagText}>ATIVO</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.metaRow}>
            <Feather name="calendar" size={12} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {formatDate(item.startTime)} — {formatDate(item.endTime)}
            </Text>
          </View>
          <Text style={[styles.durationText, { color: colors.textSecondary }]}>
            {durationDays(item)} dias
          </Text>
        </View>
        <Feather name="chevron-right" size={18} color={colors.textSecondary} />
      </Pressable>
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]} numberOfLines={1}>
          {episode.displayName}
        </Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCol}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Início</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>
              {formatDate(episode.startTime)}
            </Text>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryCol}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Término</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>
              {formatDate(episode.endTime)}
            </Text>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryCol}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Atos</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>
              {acts.length}
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Atos</Text>

      <FlatList
        data={acts}
        keyExtractor={(it) => it.uuid}
        renderItem={renderAct}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 10 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ color: colors.textSecondary, textAlign: "center", marginTop: 24 }}>
            Esta temporada não possui atos
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
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold", flex: 1, textAlign: "center" },
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  summaryRow: { flexDirection: "row", alignItems: "center" },
  summaryCol: { flex: 1, alignItems: "center", gap: 4 },
  summaryDivider: { width: 1, height: 30 },
  summaryLabel: { fontSize: 11, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.5 },
  summaryValue: { fontSize: 13, fontFamily: "Inter_700Bold" },
  sectionTitle: { fontSize: 14, fontFamily: "Inter_700Bold", paddingHorizontal: 16, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 },
  actCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  actIndex: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1,
  },
  actIndexText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  actTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  actTitle: { fontSize: 15, fontFamily: "Inter_700Bold", flexShrink: 1 },
  liveTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  liveTagText: { color: "#fff", fontSize: 9, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  durationText: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
});
