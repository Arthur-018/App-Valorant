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

export default function AgentDetailScreen() {
  const { uuid } = useLocalSearchParams();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    if (!uuid) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`https://valorant-api.com/v1/agents/${uuid}?language=pt-BR`);
      const json = await res.json();
      setAgent(json.data);
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

  if (loading) return <LoadingScreen message="Carregando agente..." />;
  if (error || !agent) return <ErrorView onRetry={load} />;

  const gradColors = agent.backgroundGradientColors;
  const bgHex = gradColors && gradColors.length > 0 ? `#${gradColors[0]}` : colors.card;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: bgHex, paddingTop: topPad + 8 }]}>
          <View style={styles.heroHeader}>
            <Pressable style={[styles.backBtn, { backgroundColor: "rgba(0,0,0,0.35)" }]} onPress={() => router.back()}>
              <Feather name="arrow-left" size={20} color="#fff" />
            </Pressable>
          </View>
          {agent.background ? (
            <Image source={{ uri: agent.background }} style={[StyleSheet.absoluteFill, { opacity: 0.15 }]} resizeMode="cover" />
          ) : null}
          {agent.fullPortrait || agent.displayIcon ? (
            <Image
              source={{ uri: agent.fullPortrait || agent.displayIcon }}
              style={styles.heroPortrait}
              resizeMode="contain"
            />
          ) : null}
          <View style={styles.heroFooter}>
            {agent.role ? (
              <View style={[styles.rolePill, { backgroundColor: "rgba(0,0,0,0.4)" }]}>
                <Text style={styles.rolePillText}>{agent.role.displayName}</Text>
              </View>
            ) : null}
            <Text style={styles.heroName}>{agent.displayName}</Text>
          </View>
        </View>

        <View style={[styles.body, { paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 24 }]}>
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>SOBRE</Text>
            <Text style={[styles.description, { color: colors.foreground }]}>{agent.description}</Text>
          </View>

          {agent.role && agent.role.description ? (
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <View style={styles.roleHeader}>
                {agent.role.displayIcon ? (
                  <Image source={{ uri: agent.role.displayIcon }} style={styles.roleIcon} />
                ) : null}
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>FUNÇÃO · {agent.role.displayName.toUpperCase()}</Text>
              </View>
              <Text style={[styles.description, { color: colors.foreground }]}>{agent.role.description}</Text>
            </View>
          ) : null}

          {agent.abilities && agent.abilities.length > 0 ? (
            <View style={{ paddingHorizontal: 16 }}>
              <Text style={[styles.abilitiesTitle, { color: colors.foreground }]}>Habilidades</Text>
              {agent.abilities
                .filter((a) => a.displayName)
                .map((ab) => (
                  <View key={ab.slot} style={[styles.abilityRow, { backgroundColor: colors.card }]}>
                    {ab.displayIcon ? (
                      <Image source={{ uri: ab.displayIcon }} style={styles.abilityIcon} />
                    ) : (
                      <View style={[styles.abilityIconPlaceholder, { backgroundColor: colors.surfaceElevated }]}>
                        <Feather name="zap" size={16} color={colors.primary} />
                      </View>
                    )}
                    <View style={styles.abilityInfo}>
                      <View style={styles.abilityHeader}>
                        <Text style={[styles.abilityName, { color: colors.foreground }]}>{ab.displayName}</Text>
                        <View style={[styles.slotBadge, { backgroundColor: colors.surfaceElevated }]}>
                          <Text style={[styles.slotBadgeText, { color: colors.textSecondary }]}>
                            {ab.slot === "Ultimate" ? "ULT" : ab.slot?.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.abilityDesc, { color: colors.textSecondary }]}>
                        {ab.description}
                      </Text>
                    </View>
                  </View>
                ))}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: { height: 380, overflow: "hidden", position: "relative" },
  heroHeader: { paddingHorizontal: 16, paddingBottom: 8, zIndex: 3 },
  heroPortrait: {
    position: "absolute",
    bottom: 0,
    right: -20,
    width: width * 0.7,
    height: 340,
    zIndex: 2,
  },
  heroFooter: { position: "absolute", bottom: 24, left: 20, zIndex: 3 },
  backBtn: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  rolePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start", marginBottom: 6 },
  rolePillText: { color: "#fff", fontSize: 11, fontFamily: "Inter_500Medium" },
  heroName: { color: "#fff", fontSize: 32, fontFamily: "Inter_700Bold" },
  body: { paddingTop: 16, gap: 12 },
  section: { marginHorizontal: 16, borderRadius: 14, padding: 16 },
  roleHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  roleIcon: { width: 16, height: 16, tintColor: "#FF4655" },
  sectionLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8, marginBottom: 8 },
  description: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  abilitiesTitle: { fontSize: 17, fontFamily: "Inter_700Bold", marginBottom: 12 },
  abilityRow: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    alignItems: "flex-start",
  },
  abilityIcon: { width: 42, height: 42, borderRadius: 8, tintColor: "#FF4655" },
  abilityIconPlaceholder: { width: 42, height: 42, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  abilityInfo: { flex: 1 },
  abilityHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  abilityName: { fontSize: 14, fontFamily: "Inter_700Bold" },
  slotBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  slotBadgeText: { fontSize: 9, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5 },
  abilityDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
});
