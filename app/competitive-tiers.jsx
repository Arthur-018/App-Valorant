import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Image,
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

const SKIP = ["UNRANKED", "Unused1", "Unused2", "SEM RANQUE"];

export default function CompetitiveTiersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("https://valorant-api.com/v1/competitivetiers?language=pt-BR");
      const json = await res.json();
      const last = (json.data || []).slice(-1)[0];
      setTiers(last?.tiers || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const groups = useMemo(() => {
    const g = {};
    for (const t of tiers) {
      if (SKIP.includes(t.tierName) || SKIP.some((s) => t.divisionName?.includes(s))) continue;
      const div = t.divisionName || "Outro";
      if (!g[div]) g[div] = [];
      g[div].push(t);
    }
    return Object.entries(g);
  }, [tiers]);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 12) : insets.top;

  if (loading) return <LoadingScreen message="Carregando patentes..." />;
  if (error) return <ErrorView onRetry={load} />;

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Patentes</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Text style={[styles.intro, { color: colors.textSecondary }]}>
          Sistema competitivo do Valorant — do Ferro 1 ao Radiante.
        </Text>

        {groups.map(([divName, divTiers]) => (
          <View key={divName} style={{ marginBottom: 18 }}>
            <Text style={[styles.divisionTitle, { color: colors.foreground }]}>{divName}</Text>
            <View style={[styles.divCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {divTiers.map((t, i) => (
                <View
                  key={t.tier}
                  style={[
                    styles.tierRow,
                    i < divTiers.length - 1 ? { borderBottomColor: colors.border, borderBottomWidth: 1 } : null,
                  ]}
                >
                  {t.largeIcon ? (
                    <Image source={{ uri: t.largeIcon }} style={styles.tierIcon} resizeMode="contain" />
                  ) : (
                    <View style={[styles.tierIcon, { backgroundColor: colors.background }]} />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.tierName, { color: colors.foreground }]}>{t.tierName}</Text>
                    <Text style={[styles.tierMeta, { color: colors.textSecondary }]}>
                      Tier {t.tier}
                    </Text>
                  </View>
                  {t.color ? (
                    <View
                      style={[
                        styles.colorDot,
                        { backgroundColor: `#${t.color.slice(0, 6)}`, borderColor: colors.border },
                      ]}
                    />
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ))}
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
  intro: { fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 18, lineHeight: 18 },
  divisionTitle: { fontSize: 13, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, paddingLeft: 4 },
  divCard: { borderRadius: 14, borderWidth: 1, paddingHorizontal: 14 },
  tierRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  tierIcon: { width: 48, height: 48 },
  tierName: { fontSize: 14, fontFamily: "Inter_700Bold" },
  tierMeta: { fontSize: 11, fontFamily: "Inter_500Medium", marginTop: 2 },
  colorDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1 },
});
