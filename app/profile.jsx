import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "../components/ScreenHeader";
import { useColors } from "../hooks/useColors";

const FAKE_USER = {
  name: "Agente Convidado",
  tag: "GUEST",
  region: "BR",
  level: 1,
};

const PLACEHOLDER_STATS = [
  { label: "Partidas", icon: "play-circle" },
  { label: "Vitórias", icon: "award" },
  { label: "K/D", icon: "target" },
  { label: "Win Rate", icon: "trending-up" },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Perfil" />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: bottomPad + 24, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.profileTop}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarLetter}>A</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <View style={styles.nameRow}>
                <Text style={[styles.name, { color: colors.foreground }]}>{FAKE_USER.name}</Text>
                <View style={[styles.tagBadge, { backgroundColor: colors.surfaceElevated }]}>
                  <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                    #{FAKE_USER.tag}
                  </Text>
                </View>
              </View>
              <View style={styles.metaRow}>
                <Feather name="map-pin" size={12} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                  Região {FAKE_USER.region}
                </Text>
                <Text style={[styles.metaSep, { color: colors.textTertiary }]}>·</Text>
                <Feather name="award" size={12} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                  Nível {FAKE_USER.level}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.notice, { backgroundColor: colors.card, borderColor: colors.primary + "55" }]}>
          <View style={[styles.noticeIcon, { backgroundColor: colors.primary + "22" }]}>
            <Feather name="lock" size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[styles.noticeTitle, { color: colors.foreground }]}>
              Estatísticas bloqueadas
            </Text>
            <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
              Estatísticas completas estarão disponíveis após integração com Riot Sign On (RSO).
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View style={[styles.sectionBar, { backgroundColor: colors.primary }]} />
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Estatísticas</Text>
        </View>

        <View style={styles.statsGrid}>
          {PLACEHOLDER_STATS.map((s) => (
            <View key={s.label} style={[styles.statBox, { backgroundColor: colors.card }]}>
              <View style={[styles.statIcon, { backgroundColor: colors.surfaceElevated }]}>
                <Feather name={s.icon} size={16} color={colors.textTertiary} />
              </View>
              <Text style={[styles.statValue, { color: colors.textTertiary }]}>—</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View style={[styles.sectionBar, { backgroundColor: colors.primary }]} />
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Conta</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, padding: 0 }]}>
          <Row icon="link" label="Conectar com Riot (em breve)" colors={colors} disabled />
          <Divider colors={colors} />
          <Row icon="settings" label="Configurações" colors={colors} disabled />
          <Divider colors={colors} />
          <Row icon="info" label="Sobre o app" colors={colors} disabled />
        </View>

        <Pressable
          style={[styles.logoutBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.replace("/login")}
        >
          <Feather name="log-out" size={16} color={colors.primary} />
          <Text style={[styles.logoutText, { color: colors.primary }]}>Sair</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Row({ icon, label, colors, disabled }) {
  return (
    <View style={[rowStyles.row, { opacity: disabled ? 0.55 : 1 }]}>
      <Feather name={icon} size={16} color={colors.textSecondary} />
      <Text style={[rowStyles.label, { color: colors.foreground }]}>{label}</Text>
      <Feather name="chevron-right" size={16} color={colors.textTertiary} />
    </View>
  );
}

function Divider({ colors }) {
  return <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 14 }} />;
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 14, paddingVertical: 16,
  },
  label: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  card: { borderRadius: 16, padding: 16 },
  profileTop: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: {
    width: 64, height: 64, borderRadius: 16,
    alignItems: "center", justifyContent: "center",
  },
  avatarLetter: { color: "#fff", fontSize: 28, fontFamily: "Inter_700Bold" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  name: { fontSize: 18, fontFamily: "Inter_700Bold" },
  tagBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, flexWrap: "wrap" },
  metaText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  metaSep: { fontSize: 12, marginHorizontal: 2 },
  notice: {
    flexDirection: "row", alignItems: "center", gap: 12,
    borderRadius: 14, borderWidth: 1, padding: 14,
  },
  noticeIcon: {
    width: 38, height: 38, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
  },
  noticeTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  noticeText: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionBar: { width: 3, height: 16, borderRadius: 2 },
  sectionTitle: {
    fontSize: 13, fontFamily: "Inter_700Bold",
    letterSpacing: 0.8, textTransform: "uppercase",
  },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statBox: {
    flexBasis: "47%", flexGrow: 1,
    borderRadius: 12, padding: 14, gap: 6,
  },
  statIcon: {
    width: 32, height: 32, borderRadius: 8,
    alignItems: "center", justifyContent: "center",
    marginBottom: 4,
  },
  statValue: { fontSize: 22, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_500Medium", letterSpacing: 0.3 },
  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, height: 48, borderRadius: 12, borderWidth: 1,
    marginTop: 4,
  },
  logoutText: { fontSize: 14, fontFamily: "Inter_700Bold" },
});
