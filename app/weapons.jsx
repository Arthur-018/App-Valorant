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
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ErrorView } from "../components/ErrorView";
import { LoadingScreen } from "../components/LoadingScreen";
import { useColors } from "../hooks/useColors";

function categoryLabel(cat) {
  return cat?.replace("EEquippableCategory::", "") ?? cat ?? "";
}

export default function WeaponsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [weapons, setWeapons] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("https://valorant-api.com/v1/weapons?language=pt-BR");
      const json = await res.json();
      setWeapons(json.data);
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

  if (loading) return <LoadingScreen message="Carregando armas..." />;
  if (error || !weapons) return <ErrorView message="Não foi possível carregar as armas" onRetry={load} />;

  const filtered = weapons.filter((w) =>
    w.displayName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.headerBar, { paddingTop: topPad + 8, backgroundColor: colors.background }]}>
        <Pressable style={[styles.backBtn, { backgroundColor: colors.card }]} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Armas</Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground, ...(Platform.OS === "web" ? { outlineStyle: "none" } : {}) }]}
            placeholder="Buscar arma..."
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

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.uuid}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.weaponCard, { backgroundColor: colors.card }]}
            onPress={() => router.push({ pathname: "/weapon-detail", params: { uuid: item.uuid } })}
          >
            <View style={styles.weaponLeft}>
              <Text style={[styles.categoryLabel, { color: colors.primary }]}>
                {categoryLabel(item.category)}
              </Text>
              <Text style={[styles.weaponName, { color: colors.foreground }]}>{item.displayName}</Text>
              {item.shopData?.cost ? (
                <View style={styles.costRow}>
                  <Feather name="dollar-sign" size={12} color={colors.gold} />
                  <Text style={[styles.costText, { color: colors.gold }]}>{item.shopData.cost}</Text>
                </View>
              ) : null}
            </View>
            {item.displayIcon ? (
              <Image source={{ uri: item.displayIcon }} style={styles.weaponImg} resizeMode="contain" />
            ) : null}
            <Feather name="chevron-right" size={18} color={colors.textSecondary} />
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={32} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhuma arma encontrada</Text>
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
  weaponCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  weaponLeft: { flex: 1, gap: 2 },
  categoryLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5 },
  weaponName: { fontSize: 16, fontFamily: "Inter_700Bold" },
  costRow: { flexDirection: "row", alignItems: "center", gap: 2, marginTop: 2 },
  costText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  weaponImg: { width: 100, height: 60 },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
