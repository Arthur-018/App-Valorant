import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
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

const { width } = Dimensions.get("window");

function categoryLabel(cat) {
  return cat?.replace("EEquippableCategory::", "") ?? cat ?? "";
}

function StatRow({ label, value }) {
  const colors = useColors();
  return (
    <View style={[statStyles.row, { borderBottomColor: colors.border }]}>
      <Text style={[statStyles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[statStyles.value, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: { fontSize: 13, fontFamily: "Inter_400Regular" },
  value: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});

export default function WeaponDetailScreen() {
  const { uuid } = useLocalSearchParams();
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

  if (loading) return <LoadingScreen message="Carregando arma..." />;
  if (error || !weapon) return <ErrorView onRetry={load} />;

  const stats = weapon.weaponStats;
  const damageRanges = stats?.damageRanges ?? [];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: colors.card, paddingTop: topPad + 8 }]}>
          <View style={styles.heroHeader}>
            <Pressable style={[styles.backBtn, { backgroundColor: colors.surfaceElevated }]} onPress={() => router.back()}>
              <Feather name="arrow-left" size={20} color={colors.foreground} />
            </Pressable>
          </View>
          {weapon.displayIcon ? (
            <Image source={{ uri: weapon.displayIcon }} style={styles.weaponImage} resizeMode="contain" />
          ) : null}
          <View style={styles.heroInfo}>
            <Text style={[styles.categoryText, { color: colors.primary }]}>{categoryLabel(weapon.category)}</Text>
            <Text style={[styles.weaponName, { color: colors.foreground }]}>{weapon.displayName}</Text>
            {weapon.shopData?.cost ? (
              <View style={styles.costRow}>
                <Feather name="dollar-sign" size={14} color={colors.gold} />
                <Text style={[styles.costText, { color: colors.gold }]}>{weapon.shopData.cost} créditos</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={[styles.body, { paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 24 }]}>
          {stats ? (
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Estatísticas</Text>
              {stats.fireRate !== undefined ? <StatRow label="Taxa de Disparo" value={`${stats.fireRate}/s`} /> : null}
              {stats.magazineSize !== undefined ? <StatRow label="Capacidade do Pente" value={stats.magazineSize} /> : null}
              {stats.reloadTimeSeconds !== undefined ? <StatRow label="Recarga" value={`${stats.reloadTimeSeconds}s`} /> : null}
              {stats.equipTimeSeconds !== undefined ? <StatRow label="Tempo de Equipe" value={`${stats.equipTimeSeconds}s`} /> : null}
              {stats.firstBulletAccuracy !== undefined ? <StatRow label="Precisão (1° tiro)" value={stats.firstBulletAccuracy} /> : null}
              {stats.shotgunPelletCount ? <StatRow label="Pelotas" value={stats.shotgunPelletCount} /> : null}
              {stats.wallPenetration ? <StatRow label="Penetração de Parede" value={stats.wallPenetration.replace("EWallPenetrationDisplayType::", "")} /> : null}
            </View>
          ) : null}

          {damageRanges.length > 0 ? (
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Dano por Distância</Text>
              {damageRanges.map((d, i) => (
                <View key={i} style={[statStyles.row, { borderBottomColor: colors.border }]}>
                  <Text style={[statStyles.label, { color: colors.textSecondary }]}>
                    {d.rangeStartMeters}–{d.rangeEndMeters}m
                  </Text>
                  <Text style={[statStyles.value, { color: colors.foreground }]}>
                    Cabeça {d.headDamage} · Corpo {d.bodyDamage} · Perna {d.legDamage}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          <Pressable
            style={[styles.skinsBtn, { backgroundColor: colors.primary }]}
            onPress={() =>
              router.push({
                pathname: "/weapon-skins",
                params: { uuid: weapon.uuid, name: weapon.displayName },
              })
            }
          >
            <Feather name="layers" size={18} color="#fff" />
            <Text style={styles.skinsBtnText}>Ver Skins ({weapon.skins?.length ?? 0})</Text>
            <Feather name="chevron-right" size={18} color="#fff" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: { paddingBottom: 24 },
  heroHeader: { paddingHorizontal: 16, marginBottom: 8 },
  backBtn: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  weaponImage: { width: width - 32, height: 140, alignSelf: "center", marginVertical: 12 },
  heroInfo: { paddingHorizontal: 20, gap: 4 },
  categoryText: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 1 },
  weaponName: { fontSize: 26, fontFamily: "Inter_700Bold" },
  costRow: { flexDirection: "row", alignItems: "center", gap: 2, marginTop: 4 },
  costText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  body: { paddingTop: 16, gap: 12, paddingHorizontal: 16 },
  section: { borderRadius: 14, padding: 16 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 12 },
  skinsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 14,
    paddingVertical: 16,
  },
  skinsBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
});
