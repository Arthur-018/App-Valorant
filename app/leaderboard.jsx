import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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
import { useColors } from "../hooks/useColors";

const REGIONS = [
  { id: "br", label: "Brasil" },
  { id: "na", label: "América do Norte" },
  { id: "latam", label: "LATAM" },
  { id: "eu", label: "Europa" },
  { id: "kr", label: "Coreia" },
  { id: "ap", label: "Ásia-Pacífico" },
];

function rankColor(rank) {
  if (rank === 1) return "#FFD700";
  if (rank === 2) return "#C0C0C0";
  if (rank === 3) return "#CD7F32";
  return null;
}

export default function LeaderboardScreen() {
  const { actUuid, actName } = useLocalSearchParams();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [region, setRegion] = useState("br");
  const [players, setPlayers] = useState([]);
  const [titlesById, setTitlesById] = useState({});
  const [cardsById, setCardsById] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(null); // null | "key" | "network" | "act"
  const [search, setSearch] = useState("");

  const load = async () => {
    if (!actUuid) return;
    setLoading(true);
    setErrorState(null);
    try {
      const apiKey = process.env.EXPO_PUBLIC_HDEV_API_KEY;
      const url = `https://api.henrikdev.xyz/valorant/v2/leaderboard/${region}?size=100&season_id=${actUuid}`;
      const headers = { Accept: "application/json" };
      if (apiKey) headers.Authorization = apiKey;
      const res = await fetch(url, { headers });
      if (res.status === 401 || res.status === 403) {
        setErrorState("key");
        setPlayers([]);
        return;
      }
      if (res.status === 404) {
        setErrorState("act");
        setPlayers([]);
        return;
      }
      if (!res.ok) {
        setErrorState("network");
        setPlayers([]);
        return;
      }
      const json = await res.json();
      const list = json?.players || json?.data?.players || json?.data || [];
      setPlayers(list.slice(0, 100));

      const [titlesRes, cardsRes] = await Promise.all([
        fetch("https://valorant-api.com/v1/playertitles?language=pt-BR"),
        fetch("https://valorant-api.com/v1/playercards?language=pt-BR"),
      ]);
      const titlesJson = await titlesRes.json();
      const cardsJson = await cardsRes.json();
      const tMap = {};
      for (const t of titlesJson.data || []) tMap[t.uuid] = t;
      const cMap = {};
      for (const c of cardsJson.data || []) cMap[c.uuid] = c;
      setTitlesById(tMap);
      setCardsById(cMap);
    } catch {
      setErrorState("network");
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [actUuid, region]);

  const filtered = useMemo(() => {
    if (!search.trim()) return players;
    const q = search.trim().toLowerCase();
    return players.filter((p) => {
      const name = (p.gameName || p.GameName || p.name || "").toLowerCase();
      const tag = (p.tagLine || p.TagLine || p.tag || "").toLowerCase();
      return name.includes(q) || tag.includes(q);
    });
  }, [players, search]);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 12) : insets.top;

  const renderPlayer = ({ item, index }) => {
    const rank = item.leaderboardRank || item.LeaderboardRank || index + 1;
    const name = item.gameName || item.GameName || item.name || "Anônimo";
    const tag = item.tagLine || item.TagLine || item.tag || "";
    const rr = item.rankedRating ?? item.RankedRating ?? 0;
    const wins = item.numberOfWins ?? item.NumberOfWins ?? 0;
    const titleId = item.titleId || item.TitleID;
    const cardId = item.PlayerCardID || item.playerCardId;
    const title = titleId ? titlesById[titleId] : null;
    const card = cardId ? cardsById[cardId] : null;
    const isHidden = !!(item.IsAnonymized || item.isAnonymized);
    const medal = rankColor(rank);

    return (
      <View style={[styles.playerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.rankBadge, { backgroundColor: medal || colors.background, borderColor: medal || colors.border }]}>
          <Text style={[styles.rankText, { color: medal ? "#0F1923" : colors.foreground }]}>
            #{rank}
          </Text>
        </View>

        {card?.smallArt ? (
          <Image source={{ uri: card.smallArt }} style={styles.cardImg} />
        ) : (
          <View style={[styles.cardImg, { backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }]}>
            <Feather name="user" size={20} color={colors.textSecondary} />
          </View>
        )}

        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.playerName, { color: colors.foreground }]} numberOfLines={1}>
            {isHidden ? "Jogador Oculto" : name}
            {tag && !isHidden ? (
              <Text style={[styles.playerTag, { color: colors.textSecondary }]}>  #{tag}</Text>
            ) : null}
          </Text>
          {title?.titleText ? (
            <Text style={[styles.titleText, { color: colors.primary }]} numberOfLines={1}>
              {title.titleText}
            </Text>
          ) : null}
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Feather name="trending-up" size={11} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>{rr} RR</Text>
            </View>
            <View style={styles.statChip}>
              <Feather name="check-circle" size={11} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>{wins} vit.</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderBody = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <Text style={{ color: colors.textSecondary }}>Carregando ranking...</Text>
        </View>
      );
    }

    if (errorState === "key") {
      return (
        <View style={styles.errorBox}>
          <Feather name="lock" size={36} color={colors.primary} />
          <Text style={[styles.errorTitle, { color: colors.foreground }]}>Chave da API necessária</Text>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            O ranking dos top 100 vem da HenrikDev API, que exige uma chave gratuita.
            Solicite uma em <Text style={{ color: colors.primary }}>discord.gg/X3GaVkX2YN</Text> e
            adicione como secret HDEV_API_KEY no Replit.
          </Text>
        </View>
      );
    }

    if (errorState === "act") {
      return (
        <View style={styles.errorBox}>
          <Feather name="alert-circle" size={36} color={colors.textSecondary} />
          <Text style={[styles.errorTitle, { color: colors.foreground }]}>Ranking indisponível</Text>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            Não há dados de leaderboard para este ato na região selecionada.
            Tente outra região ou um ato mais recente.
          </Text>
        </View>
      );
    }

    if (errorState === "network") {
      return (
        <View style={styles.errorBox}>
          <Feather name="wifi-off" size={36} color={colors.textSecondary} />
          <Text style={[styles.errorTitle, { color: colors.foreground }]}>Falha ao carregar</Text>
          <Pressable
            onPress={load}
            style={[styles.retryBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <FlatList
        data={filtered}
        keyExtractor={(p, i) => `${p.puuid || p.PlayerCardID || i}-${i}`}
        renderItem={renderPlayer}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 8 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ color: colors.textSecondary, textAlign: "center", marginTop: 32 }}>
            Nenhum jogador encontrado
          </Text>
        }
      />
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]} numberOfLines={1}>
            Top 100
          </Text>
          {actName ? (
            <Text style={[styles.headerSub, { color: colors.textSecondary }]} numberOfLines={1}>
              {actName}
            </Text>
          ) : null}
        </View>
        <View style={{ width: 38 }} />
      </View>

      <View style={styles.searchWrap}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.textSecondary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar jogador..."
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

      <View style={{ marginBottom: 12 }}>
        <FlatList
          horizontal
          data={REGIONS}
          keyExtractor={(r) => r.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.regionsRow}
          style={{ flexGrow: 0, height: 40 }}
          renderItem={({ item }) => {
            const active = region === item.id;
            return (
              <Pressable
                onPress={() => setRegion(item.id)}
                style={[
                  styles.regionChip,
                  {
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={{
                  color: active ? "#fff" : colors.textSecondary,
                  fontSize: 12,
                  fontFamily: "Inter_600SemiBold",
                }}>
                  {item.label}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {renderBody()}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  backBtn: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 2 },
  searchWrap: { paddingHorizontal: 16, paddingBottom: 10 },
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
  regionsRow: { paddingHorizontal: 16, gap: 8, alignItems: "center" },
  regionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  rankBadge: {
    minWidth: 44,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  rankText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  cardImg: { width: 40, height: 40, borderRadius: 8 },
  playerName: { fontSize: 14, fontFamily: "Inter_700Bold" },
  playerTag: { fontSize: 12, fontFamily: "Inter_400Regular" },
  titleText: { fontSize: 11, fontFamily: "Inter_500Medium", marginTop: 2, fontStyle: "italic" },
  statsRow: { flexDirection: "row", gap: 10, marginTop: 6 },
  statChip: { flexDirection: "row", alignItems: "center", gap: 4 },
  statText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  errorBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  errorTitle: { fontSize: 17, fontFamily: "Inter_700Bold", textAlign: "center" },
  errorText: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
  retryBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, marginTop: 6 },
  retryText: { color: "#fff", fontSize: 13, fontFamily: "Inter_700Bold" },
});
