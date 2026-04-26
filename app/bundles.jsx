import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
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

export default function BundlesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("https://valorant-api.com/v1/bundles?language=pt-BR");
      const json = await res.json();
      const list = (json.data || []).filter((b) => b.displayIcon || b.verticalPromoImage);
      list.sort((a, b) => (a.displayName || "").localeCompare(b.displayName || ""));
      setBundles(list);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return bundles;
    const q = search.trim().toLowerCase();
    return bundles.filter((b) =>
      (b.displayName || "").toLowerCase().includes(q) ||
      (b.description || "").toLowerCase().includes(q),
    );
  }, [bundles, search]);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 12) : insets.top;

  if (loading) return <LoadingScreen message="Carregando pacotes..." />;
  if (error) return <ErrorView onRetry={load} />;

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Pacotes</Text>
        <Pressable onPress={() => router.push("/currencies")} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <Feather name="dollar-sign" size={18} color={colors.foreground} />
        </Pressable>
      </View>

      <View style={styles.searchWrap}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.textSecondary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar pacote..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.foreground, ...(Platform.OS === "web" ? { outlineStyle: "none" } : {}) }]}
          />
          {search ? (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.textSecondary} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={[styles.notice, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="info" size={14} color={colors.primary} />
        <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
          A API pública não disponibiliza preços individuais — eles vêm da loja em tempo real. Veja a tela de Moedas para os pacotes de VP.
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(b) => b.uuid}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSelected(item)}
            style={({ pressed }) => [
              styles.bundleCard,
              { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            {item.displayIcon ? (
              <Image source={{ uri: item.displayIcon }} style={styles.bundleImg} resizeMode="cover" />
            ) : (
              <View style={[styles.bundleImg, { backgroundColor: colors.background }]} />
            )}
            <View style={styles.bundleOverlay}>
              <Text style={styles.bundleName} numberOfLines={2}>{item.displayName}</Text>
              {item.displayNameSubText ? (
                <Text style={styles.bundleSub} numberOfLines={1}>{item.displayNameSubText}</Text>
              ) : null}
            </View>
          </Pressable>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 12 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ color: colors.textSecondary, textAlign: "center", marginTop: 24 }}>
            Nenhum pacote encontrado
          </Text>
        }
      />

      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setSelected(null)}>
          <Pressable style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => {}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selected?.displayIcon ? (
                <Image source={{ uri: selected.displayIcon }} style={styles.modalImg} resizeMode="cover" />
              ) : null}
              <View style={{ padding: 18 }}>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>{selected?.displayName}</Text>
                {selected?.displayNameSubText ? (
                  <Text style={[styles.modalSub, { color: colors.primary }]}>{selected.displayNameSubText}</Text>
                ) : null}
                {selected?.description && selected.description !== selected.displayName ? (
                  <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>{selected.description}</Text>
                ) : null}
                {selected?.extraDescription ? (
                  <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>{selected.extraDescription}</Text>
                ) : null}
              </View>
            </ScrollView>
            <Pressable onPress={() => setSelected(null)} style={[styles.closeBtn, { backgroundColor: colors.background }]}>
              <Feather name="x" size={18} color={colors.foreground} />
            </Pressable>
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
  searchWrap: { paddingHorizontal: 16, paddingBottom: 12 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", padding: 0 },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  noticeText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 16 },
  bundleCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  bundleImg: { width: "100%", aspectRatio: 16 / 9 },
  bundleOverlay: { padding: 12 },
  bundleName: { fontSize: 14, fontFamily: "Inter_700Bold", color: "inherit" },
  bundleSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 4 },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", alignItems: "center", justifyContent: "center", padding: 16 },
  modalCard: { width: "100%", maxWidth: 560, maxHeight: "92%", borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  modalImg: { width: "100%", aspectRatio: 16 / 9 },
  modalTitle: { fontSize: 22, fontFamily: "Inter_700Bold" },
  modalSub: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginTop: 4 },
  modalDesc: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 12, lineHeight: 20 },
  closeBtn: { position: "absolute", top: 12, right: 12, width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
});
