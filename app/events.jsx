import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

function statusOf(ev) {
  const now = Date.now();
  const start = new Date(ev.startTime).getTime();
  const end = new Date(ev.endTime).getTime();
  if (now < start) return "upcoming";
  if (now > end) return "ended";
  return "ongoing";
}

function durationDays(ev) {
  const ms = new Date(ev.endTime).getTime() - new Date(ev.startTime).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export default function EventsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("https://valorant-api.com/v1/events?language=pt-BR");
      const json = await res.json();
      const list = (json.data || []).slice();
      list.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
      setEvents(list);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 12) : insets.top;

  if (loading) return <LoadingScreen message="Carregando eventos..." />;
  if (error) return <ErrorView onRetry={load} />;

  const renderEvent = ({ item }) => {
    const status = statusOf(item);
    const statusLabel =
      status === "ongoing" ? { text: "EM ANDAMENTO", bg: colors.primary, fg: "#fff" } :
      status === "upcoming" ? { text: "EM BREVE", bg: "#3498DB", fg: "#fff" } :
      { text: "ENCERRADO", bg: colors.background, fg: colors.textSecondary };

    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: status === "ongoing" ? colors.primary : colors.border }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.eventIcon, { backgroundColor: colors.background }]}>
            <Feather name="calendar" size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.eventName, { color: colors.foreground }]} numberOfLines={2}>
              {item.displayName}
            </Text>
            {item.shortDisplayName && item.shortDisplayName !== item.displayName ? (
              <Text style={[styles.eventShort, { color: colors.textSecondary }]} numberOfLines={1}>
                {item.shortDisplayName}
              </Text>
            ) : null}
          </View>
          <View style={[styles.statusTag, { backgroundColor: statusLabel.bg }]}>
            <Text style={[styles.statusText, { color: statusLabel.fg }]}>{statusLabel.text}</Text>
          </View>
        </View>

        <View style={[styles.dateRow, { borderTopColor: colors.border }]}>
          <View style={styles.dateCol}>
            <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Início</Text>
            <Text style={[styles.dateValue, { color: colors.foreground }]}>{formatDate(item.startTime)}</Text>
          </View>
          <View style={[styles.dateDivider, { backgroundColor: colors.border }]} />
          <View style={styles.dateCol}>
            <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Término</Text>
            <Text style={[styles.dateValue, { color: colors.foreground }]}>{formatDate(item.endTime)}</Text>
          </View>
          <View style={[styles.dateDivider, { backgroundColor: colors.border }]} />
          <View style={styles.dateCol}>
            <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Duração</Text>
            <Text style={[styles.dateValue, { color: colors.foreground }]}>{durationDays(item)} dias</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Eventos</Text>
        <View style={{ width: 38 }} />
      </View>

      <FlatList
        data={events}
        keyExtractor={(e) => e.uuid}
        renderItem={renderEvent}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 12 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ color: colors.textSecondary, textAlign: "center", marginTop: 24 }}>
            Nenhum evento disponível
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
  card: { borderRadius: 14, borderWidth: 1, padding: 16 },
  cardHeader: { flexDirection: "row", gap: 12, alignItems: "center", marginBottom: 12 },
  eventIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  eventName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  eventShort: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 2 },
  statusTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 9, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  dateRow: { flexDirection: "row", alignItems: "center", paddingTop: 12, borderTopWidth: 1 },
  dateCol: { flex: 1, alignItems: "center", gap: 4 },
  dateDivider: { width: 1, height: 28 },
  dateLabel: { fontSize: 10, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.4 },
  dateValue: { fontSize: 12, fontFamily: "Inter_700Bold" },
});
