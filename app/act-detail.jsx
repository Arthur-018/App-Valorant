import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
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
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function isOngoing(s) {
  const now = Date.now();
  return now >= new Date(s.startTime).getTime() && now <= new Date(s.endTime).getTime();
}

function durationDays(s) {
  const ms = new Date(s.endTime).getTime() - new Date(s.startTime).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export default function ActDetailScreen() {
  const { uuid, episodeName } = useLocalSearchParams();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [act, setAct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    if (!uuid) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("https://valorant-api.com/v1/seasons?language=pt-BR");
      const json = await res.json();
      const found = (json.data || []).find((s) => s.uuid === uuid);
      setAct(found || null);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [uuid]);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 12) : insets.top;
  const ongoing = useMemo(() => (act ? isOngoing(act) : false), [act]);

  if (loading) return <LoadingScreen message="Carregando ato..." />;
  if (error) return <ErrorView onRetry={load} />;
  if (!act) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <View style={styles.headerBar}>
          <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Ato</Text>
          <View style={{ width: 38 }} />
        </View>
        <Text style={{ color: colors.textSecondary, textAlign: "center", marginTop: 40 }}>
          Ato não encontrado
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]} numberOfLines={1}>
          {act.displayName}
        </Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}>
        {episodeName ? (
          <Text style={[styles.episodeBreadcrumb, { color: colors.textSecondary }]}>
            {episodeName}
          </Text>
        ) : null}

        <View style={styles.titleRow}>
          <Text style={[styles.actTitle, { color: colors.foreground }]}>
            {act.displayName}
          </Text>
          {ongoing ? (
            <View style={[styles.liveTag, { backgroundColor: colors.primary }]}>
              <Text style={styles.liveTagText}>EM ANDAMENTO</Text>
            </View>
          ) : null}
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: colors.background }]}>
              <Feather name="play" size={16} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Início</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>
                {formatDate(act.startTime)}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: colors.background }]}>
              <Feather name="square" size={16} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Término</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>
                {formatDate(act.endTime)}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: colors.background }]}>
              <Feather name="clock" size={16} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Duração</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>
                {durationDays(act)} dias
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/leaderboard",
              params: { actUuid: act.uuid, actName: act.displayName },
            })
          }
          style={({ pressed }) => [
            styles.ctaBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Feather name="award" size={18} color="#fff" />
          <Text style={styles.ctaText}>VER TOP 100 JOGADORES</Text>
          <Feather name="chevron-right" size={18} color="#fff" />
        </Pressable>

        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          Os 100 melhores jogadores Radiantes deste ato, conforme o ranking competitivo.
        </Text>
      </ScrollView>
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
  episodeBreadcrumb: { fontSize: 12, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 18 },
  actTitle: { fontSize: 26, fontFamily: "Inter_700Bold", flexShrink: 1 },
  liveTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  liveTagText: { color: "#fff", fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  infoCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 22 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 6 },
  infoIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  infoLabel: { fontSize: 11, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.5 },
  infoValue: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginTop: 2 },
  divider: { height: 1, marginVertical: 6 },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
  },
  ctaText: { color: "#fff", fontSize: 14, fontFamily: "Inter_700Bold", letterSpacing: 1 },
  helperText: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center", marginTop: 12, lineHeight: 18 },
});
