import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
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

const ROTATION_MAP_NAMES = [
  "Ascent",
  "Bind",
  "Haven",
  "Sunset",
  "Lotus",
  "Abyss",
  "Corrode",
];

const FILTERS = [
  { id: "all", label: "Todos os mapas" },
  { id: "rotation", label: "Rotação competitiva" },
];

export default function MapsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [maps, setMaps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("https://valorant-api.com/v1/maps?language=pt-BR");
      const json = await res.json();
      setMaps(json.data.filter((m) => m.splash));
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

  const visibleMaps = useMemo(() => {
    if (!maps) return [];
    if (filter === "rotation") {
      return maps.filter((m) => ROTATION_MAP_NAMES.includes(m.displayName));
    }
    return maps.filter((m) => m.coordinates);
  }, [maps, filter]);

  if (loading) return <LoadingScreen message="Carregando mapas..." />;
  if (error || !maps) return <ErrorView message="Não foi possível carregar os mapas" onRetry={load} />;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.headerBar, { paddingTop: topPad + 8, backgroundColor: colors.background }]}>
        <Pressable style={[styles.backBtn, { backgroundColor: colors.card }]} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Mapas</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <Pressable
              key={f.id}
              onPress={() => setFilter(f.id)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: active ? colors.primary : colors.card,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: active ? "#fff" : colors.foreground },
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={visibleMaps}
        keyExtractor={(item) => item.uuid}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 20,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.mapCard, { backgroundColor: colors.card }]}>
            {item.splash ? (
              <Image source={{ uri: item.splash }} style={styles.mapSplash} resizeMode="cover" />
            ) : null}
            <View style={[styles.mapOverlay, { backgroundColor: "rgba(15,25,35,0.55)" }]} />
            <View style={styles.mapInfo}>
              <Text style={styles.mapName}>{item.displayName}</Text>
              {item.coordinates ? (
                <View style={styles.coordRow}>
                  <Feather name="map-pin" size={11} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.coordText}>{item.coordinates}</Text>
                </View>
              ) : null}
              {item.tacticalDescription ? (
                <View style={[styles.descBadge, { backgroundColor: "rgba(255,70,85,0.25)" }]}>
                  <Text style={styles.descBadgeText}>{item.tacticalDescription}</Text>
                </View>
              ) : null}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="map" size={32} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Nenhum mapa nesta categoria
            </Text>
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
  filterScroll: { flexGrow: 0, height: 48 },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  filterChipText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  mapCard: {
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  mapSplash: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%" },
  mapOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  mapInfo: { position: "absolute", bottom: 16, left: 16, right: 16 },
  mapName: { color: "#fff", fontSize: 22, fontFamily: "Inter_700Bold", marginBottom: 6 },
  coordRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 8 },
  coordText: { color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "Inter_400Regular" },
  descBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  descBadgeText: { color: "#FF4655", fontSize: 11, fontFamily: "Inter_500Medium" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
