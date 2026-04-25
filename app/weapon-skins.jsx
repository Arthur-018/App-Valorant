import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
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
  const { uuid, name, openSkin } = useLocalSearchParams();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [weapon, setWeapon] = useState(null);
  const [themes, setThemes] = useState({});
  const [tiers, setTiers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSkin, setSelectedSkin] = useState(null);

  const load = async () => {
    if (!uuid) return;
    setLoading(true);
    setError(false);
    try {
      const [wRes, tRes, cRes] = await Promise.all([
        fetch(`https://valorant-api.com/v1/weapons/${uuid}?language=pt-BR`),
        fetch("https://valorant-api.com/v1/themes?language=pt-BR"),
        fetch("https://valorant-api.com/v1/contenttiers?language=pt-BR"),
      ]);
      const [wJson, tJson, cJson] = await Promise.all([
        wRes.json(),
        tRes.json(),
        cRes.json(),
      ]);
      setWeapon(wJson.data);
      const themeMap = {};
      (tJson.data || []).forEach((t) => (themeMap[t.uuid] = t));
      setThemes(themeMap);
      const tierMap = {};
      (cJson.data || []).forEach((c) => (tierMap[c.uuid] = c));
      setTiers(tierMap);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [uuid]);

  useEffect(() => {
    if (openSkin && weapon?.skins) {
      const found = weapon.skins.find((s) => s.uuid === openSkin);
      if (found) setSelectedSkin(found);
    }
  }, [openSkin, weapon]);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 24) : insets.top;

  const skins = useMemo(
    () => (weapon?.skins ?? []).filter((s) => getSkinImage(s)),
    [weapon],
  );

  if (loading) return <LoadingScreen message="Carregando skins..." />;
  if (error || !weapon) return <ErrorView onRetry={load} />;

  const selectedTheme = selectedSkin ? themes[selectedSkin.themeUuid] : null;
  const selectedTier = selectedSkin ? tiers[selectedSkin.contentTierUuid] : null;
  const selectedImg = selectedSkin ? getSkinImage(selectedSkin) : null;
  const tierColor = selectedTier?.highlightColor
    ? `#${selectedTier.highlightColor.slice(0, 6)}`
    : colors.textSecondary;

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
            <Pressable
              style={[styles.skinCard, { backgroundColor: colors.card }]}
              onPress={() => setSelectedSkin(item)}
            >
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
            </Pressable>
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

      <Modal
        visible={!!selectedSkin}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedSkin(null)}
      >
        <Pressable style={styles.backdrop} onPress={() => setSelectedSkin(null)}>
          <Pressable
            style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={(e) => e.stopPropagation?.()}
          >
            <Pressable
              style={[styles.closeBtn, { backgroundColor: colors.surfaceElevated }]}
              onPress={() => setSelectedSkin(null)}
              hitSlop={8}
            >
              <Feather name="x" size={18} color={colors.foreground} />
            </Pressable>

            {selectedSkin ? (
              <>
                <View style={[styles.modalImgBox, { backgroundColor: colors.surfaceElevated }]}>
                  {selectedImg ? (
                    <Image
                      source={{ uri: selectedImg }}
                      style={styles.modalImg}
                      resizeMode="contain"
                    />
                  ) : (
                    <Feather name="image" size={40} color={colors.textTertiary} />
                  )}
                </View>

                <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                  {selectedSkin.displayName}
                </Text>

                {selectedTier ? (
                  <View style={styles.tierRow}>
                    {selectedTier.displayIcon ? (
                      <Image source={{ uri: selectedTier.displayIcon }} style={styles.tierIcon} />
                    ) : null}
                    <Text style={[styles.tierText, { color: tierColor }]}>
                      {selectedTier.displayName}
                    </Text>
                  </View>
                ) : null}

                <View style={[styles.infoBox, { backgroundColor: colors.surfaceElevated }]}>
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Pacote</Text>
                    <Text style={[styles.infoValue, { color: colors.foreground }]} numberOfLines={2}>
                      {selectedTheme?.displayName || "Avulsa"}
                    </Text>
                  </View>
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Variantes</Text>
                    <Text style={[styles.infoValue, { color: colors.foreground }]}>
                      {selectedSkin.chromas?.length || 1} {selectedSkin.chromas?.length === 1 ? "croma" : "cromas"}
                    </Text>
                  </View>
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Níveis</Text>
                    <Text style={[styles.infoValue, { color: colors.foreground }]}>
                      {selectedSkin.levels?.length || 1}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.releaseNote, { color: colors.textTertiary }]}>
                  A data de lançamento exata não é exposta publicamente pela API.
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

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    paddingTop: 24,
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
  modalImgBox: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  modalImg: { width: "100%", height: "100%" },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  tierRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: -4,
  },
  tierIcon: { width: 18, height: 18 },
  tierText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  infoBox: {
    borderRadius: 12,
    padding: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
  },
  infoLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  infoValue: { fontSize: 13, fontFamily: "Inter_600SemiBold", flexShrink: 1, textAlign: "right" },
  divider: { height: 1, marginHorizontal: 12 },
  releaseNote: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    fontStyle: "italic",
  },
});
