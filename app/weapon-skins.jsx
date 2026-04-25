import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
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

function getSkinImage(skin) {
  return (
    skin.chromas?.[0]?.fullRender ||
    skin.chromas?.[0]?.displayIcon ||
    skin.levels?.[0]?.displayIcon ||
    skin.displayIcon ||
    null
  );
}

export default function WeaponSkinsScreen() {
  const { uuid, name } = useLocalSearchParams();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [weapon, setWeapon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    if (!uuid) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`https://valorant-api.com/v1/weapons/${uuid}?language=pt-BR`);
      const json = await res.json();
      setWeapon(json.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [uuid]);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 24) : insets.top;

  if (loading) return <LoadingScreen message="Carregando skins..." />;
  if (error || !weapon) return <ErrorView onRetry={load} />;

  const skins = (weapon.skins ?? []).filter((s) => getSkinImage(s));

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.headerBar, { paddingTop: topPad + 8, backgroundColor: colors.background }]}>
        <Pressable style={[styles.backBtn, { backgroundColor: colors.card }]} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerTextBox}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Skins</Text>
          {name ? <Text style={[styles.headerSub, { color: colors.textSecondary }]}>{name}</Text> : null}
        </View>
        <View style={{ width: 38 }} />
      </View>

      <FlatList
        data={skins}
        keyExtractor={(item) => item.uuid}
        numColumns={2}
        columnWrapperStyle={{ gap: 10 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const img = getSkinImage(item);
          return (
            <View style={[styles.skinCard, { backgroundColor: colors.card }]}>
              <View style={[styles.skinImgBox, { backgroundColor: colors.surfaceElevated }]}>
                {img ? (
                  <Image source={{ uri: img }} style={styles.skinImg} resizeMode="contain" />
                ) : (
                  <Feather name="image" size={28} color={colors.textTertiary} />
                )}
              </View>
              <Text style={[styles.skinName, { color: colors.foreground }]} numberOfLines={2}>
                {item.displayName}
              </Text>
              {item.chromas && item.chromas.length > 1 ? (
                <Text style={[styles.chromaCount, { color: colors.textSecondary }]}>
                  {item.chromas.length} cromas
                </Text>
              ) : null}
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="layers" size={32} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhuma skin disponível</Text>
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
  headerTextBox: { alignItems: "center" },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  skinCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 10,
  },
  skinImgBox: {
    width: "100%",
    height: 90,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  skinImg: { width: "100%", height: "100%" },
  skinName: { fontSize: 13, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  chromaCount: { fontSize: 11, fontFamily: "Inter_400Regular" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
