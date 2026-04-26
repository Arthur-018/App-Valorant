import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function VersionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("https://valorant-api.com/v1/version");
      const json = await res.json();
      setData(json.data || null);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 12) : insets.top;

  if (loading) return <LoadingScreen message="Carregando versão..." />;
  if (error) return <ErrorView onRetry={load} />;

  const rows = [
    { label: "Versão do jogo", value: data?.version, icon: "tag" },
    { label: "Branch", value: data?.branch, icon: "git-branch" },
    { label: "Build", value: data?.buildVersion, icon: "package" },
    { label: "Versão da Engine", value: data?.engineVersion, icon: "cpu" },
    { label: "Versão do Riot Client", value: data?.riotClientVersion, icon: "monitor" },
    { label: "Build do Riot Client", value: data?.riotClientBuild, icon: "monitor" },
    { label: "Manifest ID", value: data?.manifestId, icon: "hash" },
  ];

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Versão atual</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.heroIcon, { backgroundColor: colors.primary }]}>
            <Feather name="git-commit" size={28} color="#fff" />
          </View>
          <Text style={[styles.heroVersion, { color: colors.foreground }]}>
            {data?.branch?.replace("release-", "")}
          </Text>
          <Text style={[styles.heroSub, { color: colors.textSecondary }]}>
            Patch ativo do Valorant
          </Text>
          {data?.buildDate ? (
            <View style={[styles.dateBadge, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Feather name="calendar" size={12} color={colors.textSecondary} />
              <Text style={[styles.dateBadgeText, { color: colors.textSecondary }]}>
                Compilado em {formatDate(data.buildDate)}
              </Text>
            </View>
          ) : null}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Detalhes técnicos</Text>

        <View style={[styles.list, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {rows.map((row, idx) => (
            <View
              key={row.label}
              style={[
                styles.row,
                idx < rows.length - 1 ? { borderBottomColor: colors.border, borderBottomWidth: 1 } : null,
              ]}
            >
              <View style={[styles.rowIcon, { backgroundColor: colors.background }]}>
                <Feather name={row.icon} size={14} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{row.label}</Text>
                <Text style={[styles.rowValue, { color: colors.foreground }]} numberOfLines={1}>
                  {row.value || "—"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={[styles.helper, { color: colors.textSecondary }]}>
          Esses dados são atualizados automaticamente pela valorant-api.com a cada novo patch.
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
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  heroCard: {
    alignItems: "center",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    gap: 8,
  },
  heroIcon: { width: 60, height: 60, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  heroVersion: { fontSize: 30, fontFamily: "Inter_700Bold" },
  heroSub: { fontSize: 13, fontFamily: "Inter_500Medium" },
  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    marginTop: 8,
  },
  dateBadgeText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  sectionTitle: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 },
  list: { borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, marginBottom: 14 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
  rowIcon: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  rowLabel: { fontSize: 11, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.4 },
  rowValue: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginTop: 2 },
  helper: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 18 },
});
