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

export default function TitlesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [titles, setTitles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("https://valorant-api.com/v1/playertitles?language=pt-BR");
      const json = await res.json();
      setTitles((json.data || []).filter((t) => t.titleText && t.titleText.trim()));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 24) : insets.top;

  const visible = useMemo(() => {
    if (!titles) return [];
    const q = search.trim().toLowerCase();
    if (!q) return titles;
    return titles.filter(
      (t) =>
        (t.titleText || "").toLowerCase().includes(q) ||
        (t.displayName || "").toLowerCase().includes(q),
    );
  }, [titles, search]);

  if (loading) return <LoadingScreen message="Carregando títulos..." />;
  if (error || !titles) return <ErrorView message="Não foi possível carregar os títulos" onRetry={load} />;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.headerBar, { paddingTop: topPad + 8, backgroundColor: colors.background }]}>
        <Pressable style={[styles.backBtn, { backgroundColor: colors.card }]} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Títulos</Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.textSecondary} />
          <TextInput
            style={[
              styles.searchInput,
              { color: colors.foreground, ...(Platform.OS === "web" ? { outlineStyle: "none" } : {}) },
            ]}
            placeholder="Buscar título..."
            placeholderTextColor={colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <Pressable onPress={() => setSearch("")} hitSlop={8}>
              <Feather name="x" size={16} color={colors.textSecondary} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <FlatList
        data={visible}
        keyExtractor={(item) => item.uuid}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 20,
          gap: 8,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.titleCard, { backgroundColor: colors.card }]}>
            <View style={[styles.iconBox, { backgroundColor: colors.surfaceElevated }]}>
              <Feather name="award" size={18} color={colors.gold} />
            </View>
            <View style={styles.titleTextBox}>
              <Text style={[styles.titleText, { color: colors.foreground }]} numberOfLines={2}>
                {item.titleText}
              </Text>
              {item.displayName && item.displayName !== item.titleText ? (
                <Text style={[styles.titleSub, { color: colors.textSecondary }]} numberOfLines={1}>
                  {item.displayName}
                </Text>
              ) : null}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={32} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhum título encontrado</Text>
          </View>
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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  titleCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  titleTextBox: { flex: 1, gap: 2 },
  titleText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  titleSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
