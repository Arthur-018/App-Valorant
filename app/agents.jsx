import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ErrorView } from "../components/ErrorView";
import { LoadingScreen } from "../components/LoadingScreen";
import { useColors } from "../hooks/useColors";

const ROLE_FILTERS = [
  { key: "all", label: "Todos" },
  { key: "Duelista", label: "Duelistas" },
  { key: "Iniciador", label: "Iniciadores" },
  { key: "Sentinela", label: "Sentinelas" },
  { key: "Controlador", label: "Controladores" },
];

export default function AgentsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [agents, setAgents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(
        "https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=pt-BR",
      );
      const json = await res.json();
      setAgents(json.data);
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

  if (loading) return <LoadingScreen message="Carregando agentes..." />;
  if (error || !agents) return <ErrorView message="Não foi possível carregar os agentes" onRetry={load} />;

  const filtered = agents.filter((a) => {
    const matchesSearch = a.displayName.toLowerCase().includes(search.toLowerCase());
    const matchesRole = role === "all" || a.role?.displayName === role;
    return matchesSearch && matchesRole;
  });

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.headerBar, { paddingTop: topPad + 8, backgroundColor: colors.background }]}>
        <Pressable style={[styles.backBtn, { backgroundColor: colors.card }]} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Agentes</Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground, ...(Platform.OS === "web" ? { outlineStyle: "none" } : {}) }]}
            placeholder="Buscar agente..."
            placeholderTextColor={colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.textSecondary} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsRow}
      >
        {ROLE_FILTERS.map((r) => {
          const active = role === r.key;
          return (
            <Pressable
              key={r.key}
              onPress={() => setRole(r.key)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? colors.primary : colors.card,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: active ? "#fff" : colors.textSecondary },
                ]}
              >
                {r.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.uuid}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const gradColors = item.backgroundGradientColors;
          const bgColor = gradColors && gradColors.length > 0 ? `#${gradColors[0]}` : colors.card;
          return (
            <Pressable
              style={[styles.agentCard, { backgroundColor: bgColor }]}
              onPress={() => router.push({ pathname: "/agent-detail", params: { uuid: item.uuid } })}
            >
              <View style={[styles.agentOverlay, { backgroundColor: "rgba(0,0,0,0.35)" }]} />
              {item.displayIcon ? (
                <Image source={{ uri: item.displayIcon }} style={styles.agentImage} resizeMode="contain" />
              ) : null}
              <View style={styles.agentInfo}>
                {item.role ? (
                  <View style={[styles.roleBadge, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
                    <Text style={styles.roleText}>{item.role.displayName}</Text>
                  </View>
                ) : null}
                <Text style={styles.agentName} numberOfLines={1}>{item.displayName}</Text>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={32} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhum agente encontrado</Text>
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
  chipsScroll: { flexGrow: 0, height: 48 },
  chipsRow: { paddingHorizontal: 16, gap: 8, alignItems: "center" },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  row: { gap: 10, marginBottom: 10 },
  agentCard: {
    flex: 1,
    height: 200,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
  },
  agentOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  agentImage: { position: "absolute", bottom: 0, right: -10, width: 130, height: 160 },
  agentInfo: { position: "absolute", bottom: 12, left: 10, right: 10 },
  roleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  roleText: { color: "#fff", fontSize: 10, fontFamily: "Inter_500Medium" },
  agentName: { color: "#fff", fontSize: 15, fontFamily: "Inter_700Bold" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
