import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
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

export default function BannersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [banners, setBanners] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("https://valorant-api.com/v1/playercards?language=pt-BR");
      const json = await res.json();
      setBanners((json.data || []).filter((b) => b.displayIcon || b.largeArt));
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
    if (!banners) return [];
    const q = search.trim().toLowerCase();
    if (!q) return banners;
    return banners.filter((b) => (b.displayName || "").toLowerCase().includes(q));
  }, [banners, search]);

  if (loading) return <LoadingScreen message="Carregando banners..." />;
  if (error || !banners) return <ErrorView message="Não foi possível carregar os banners" onRetry={load} />;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.headerBar, { paddingTop: topPad + 8, backgroundColor: colors.background }]}>
        <Pressable style={[styles.backBtn, { backgroundColor: colors.card }]} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Banners</Text>
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
            placeholder="Buscar banner..."
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
        numColumns={3}
        columnWrapperStyle={{ gap: 10 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 20,
          gap: 10,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.bannerCard, { backgroundColor: colors.card }]}
            onPress={() => setSelected(item)}
          >
            {item.smallArt || item.displayIcon ? (
              <Image
                source={{ uri: item.smallArt || item.displayIcon }}
                style={styles.bannerImg}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.bannerImg, { alignItems: "center", justifyContent: "center" }]}>
                <Feather name="image" size={24} color={colors.textTertiary} />
              </View>
            )}
            <Text style={[styles.bannerName, { color: colors.foreground }]} numberOfLines={2}>
              {item.displayName}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={32} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhum banner encontrado</Text>
          </View>
        }
      />

      <Modal
        visible={!!selected}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <Pressable style={styles.backdrop} onPress={() => setSelected(null)}>
          <Pressable
            style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={(e) => e.stopPropagation?.()}
          >
            <Pressable
              style={[styles.closeBtn, { backgroundColor: colors.surfaceElevated }]}
              onPress={() => setSelected(null)}
              hitSlop={8}
            >
              <Feather name="x" size={18} color={colors.foreground} />
            </Pressable>

            {selected ? (
              <>
                {selected.wideArt || selected.largeArt || selected.displayIcon ? (
                  <Image
                    source={{ uri: selected.wideArt || selected.largeArt || selected.displayIcon }}
                    style={styles.modalImg}
                    resizeMode="contain"
                  />
                ) : null}
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                  {selected.displayName}
                </Text>
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
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
  bannerCard: {
    flex: 1,
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
    gap: 8,
  },
  bannerImg: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: "#0F1923",
  },
  bannerName: { fontSize: 11, fontFamily: "Inter_500Medium", textAlign: "center" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 460,
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    paddingTop: 28,
    alignItems: "stretch",
    gap: 14,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  modalImg: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 10,
    backgroundColor: "#0F1923",
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
});
