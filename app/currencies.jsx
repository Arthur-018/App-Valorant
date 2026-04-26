import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
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

const VP_PACKAGES = [
  { vp: 475,    bonus: 0,    brl: 9.90 },
  { vp: 1000,   bonus: 50,   brl: 19.90 },
  { vp: 2050,   bonus: 125,  brl: 39.90 },
  { vp: 3650,   bonus: 300,  brl: 69.90 },
  { vp: 5350,   bonus: 650,  brl: 99.90 },
  { vp: 11000,  bonus: 1700, brl: 199.90 },
];

const CURRENCY_DESCRIPTIONS = {
  "VALORANT POINTS": "Moeda premium do jogo, comprada com dinheiro real. Usada para skins, agentes e Passe de Batalha.",
  "RADIANITE Points": "Pontos para evoluir skins (variantes, animações e finalizadores). Vêm com pacotes de VP e do Passe.",
  "Créditos Kingdom": "Moeda gratuita ganha jogando partidas. Pode trocar por agentes antigos e itens da loja Kingdom.",
  "Agentes grátis": "Tokens que liberam um novo agente sem custo, ganhos pelo Passe de Batalha.",
};

const CURRENCY_PURCHASE = {
  "VALORANT POINTS": "Comprado com dinheiro real",
  "RADIANITE Points": "Vem junto com pacotes de VP e bundles",
  "Créditos Kingdom": "Ganho jogando — não comprável",
  "Agentes grátis": "Ganho pelo Passe de Batalha",
};

function formatBRL(n) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CurrenciesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("https://valorant-api.com/v1/currencies?language=pt-BR");
      const json = await res.json();
      setCurrencies(json.data || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 12) : insets.top;

  if (loading) return <LoadingScreen message="Carregando moedas..." />;
  if (error) return <ErrorView onRetry={load} />;

  const totalVPAllPackages = VP_PACKAGES.reduce((s, p) => s + p.vp + p.bonus, 0);
  const totalBRLAllPackages = VP_PACKAGES.reduce((s, p) => s + p.brl, 0);
  const bestRate = VP_PACKAGES.reduce((best, p) => {
    const total = p.vp + p.bonus;
    const rate = total / p.brl;
    return rate > best.rate ? { ...p, rate, total } : best;
  }, { rate: 0 });

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Moedas</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Tipos de moeda</Text>

        <View style={{ gap: 10, marginBottom: 24 }}>
          {currencies.map((c) => (
            <View key={c.uuid} style={[styles.currencyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {c.displayIcon ? (
                <Image source={{ uri: c.displayIcon }} style={styles.currencyIcon} resizeMode="contain" />
              ) : (
                <View style={[styles.currencyIcon, { backgroundColor: colors.background }]} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={[styles.currencyName, { color: colors.foreground }]}>{c.displayName}</Text>
                {CURRENCY_DESCRIPTIONS[c.displayName] ? (
                  <Text style={[styles.currencyDesc, { color: colors.textSecondary }]}>
                    {CURRENCY_DESCRIPTIONS[c.displayName]}
                  </Text>
                ) : null}
                {CURRENCY_PURCHASE[c.displayName] ? (
                  <View style={[styles.purchaseTag, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Feather name="shopping-cart" size={11} color={colors.primary} />
                    <Text style={[styles.purchaseText, { color: colors.foreground }]}>
                      {CURRENCY_PURCHASE[c.displayName]}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Pacotes de VALORANT POINTS</Text>
        <Text style={[styles.intro, { color: colors.textSecondary }]}>
          Preços referenciais do Brasil. Os bônus são adicionados ao saldo no momento da compra.
        </Text>

        <View style={{ gap: 8, marginBottom: 18 }}>
          {VP_PACKAGES.map((p) => {
            const total = p.vp + p.bonus;
            const isBest = p.vp === bestRate.vp;
            return (
              <View
                key={p.vp}
                style={[
                  styles.packageCard,
                  { backgroundColor: colors.card, borderColor: isBest ? colors.primary : colors.border },
                ]}
              >
                <View style={[styles.packageBadge, { backgroundColor: isBest ? colors.primary : colors.background }]}>
                  <Text style={[styles.packageBadgeText, { color: isBest ? "#fff" : colors.foreground }]}>
                    {p.vp.toLocaleString("pt-BR")}
                  </Text>
                  <Text style={[styles.packageBadgeSub, { color: isBest ? "#fff" : colors.textSecondary }]}>VP</Text>
                </View>
                <View style={{ flex: 1 }}>
                  {p.bonus > 0 ? (
                    <Text style={[styles.bonusText, { color: colors.primary }]}>
                      +{p.bonus.toLocaleString("pt-BR")} VP de bônus
                    </Text>
                  ) : (
                    <Text style={[styles.bonusText, { color: colors.textSecondary }]}>Sem bônus</Text>
                  )}
                  <Text style={[styles.totalText, { color: colors.foreground }]}>
                    Total: {total.toLocaleString("pt-BR")} VP
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={[styles.priceText, { color: colors.foreground }]}>{formatBRL(p.brl)}</Text>
                  {isBest ? (
                    <View style={[styles.bestTag, { backgroundColor: colors.primary }]}>
                      <Text style={styles.bestText}>MELHOR</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>

        <View style={[styles.totalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="shopping-bag" size={22} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Comprando todos os pacotes</Text>
            <Text style={[styles.totalValue, { color: colors.foreground }]}>
              {totalVPAllPackages.toLocaleString("pt-BR")} VP
            </Text>
            <Text style={[styles.totalCost, { color: colors.primary }]}>
              {formatBRL(totalBRLAllPackages)}
            </Text>
          </View>
        </View>

        <Text style={[styles.helper, { color: colors.textSecondary }]}>
          Valores aproximados — a Riot pode ajustar preços e bônus a qualquer momento.
        </Text>
      </ScrollView>
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
  sectionTitle: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 },
  intro: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 12, lineHeight: 17 },
  currencyCard: { flexDirection: "row", gap: 12, padding: 14, borderRadius: 12, borderWidth: 1 },
  currencyIcon: { width: 48, height: 48, borderRadius: 8 },
  currencyName: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 4 },
  currencyDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  purchaseTag: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    marginTop: 8,
  },
  purchaseText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  packageCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  packageBadge: { minWidth: 70, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, alignItems: "center" },
  packageBadgeText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  packageBadgeSub: { fontSize: 10, fontFamily: "Inter_500Medium", letterSpacing: 0.5 },
  bonusText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  totalText: { fontSize: 13, fontFamily: "Inter_700Bold", marginTop: 2 },
  priceText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  bestTag: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, marginTop: 4 },
  bestText: { color: "#fff", fontSize: 9, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  totalCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  totalLabel: { fontSize: 11, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.5 },
  totalValue: { fontSize: 18, fontFamily: "Inter_700Bold", marginTop: 2 },
  totalCost: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginTop: 2 },
  helper: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 16 },
});
