import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "../components/ScreenHeader";
import { AGENTS } from "../data/mock/agents";
import { useColors } from "../hooks/useColors";

export default function AgentsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const filtered = AGENTS.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Agentes" />

      <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Buscar agente..."
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
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomPad + 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.agentCard, { backgroundColor: item.color }]}>
            <View style={styles.agentOverlay} />
            <View style={[styles.agentIconBubble, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
              <Feather name={item.icon} size={42} color="#fff" />
            </View>
            <View style={styles.agentInfo}>
              <View style={[styles.roleBadge, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
                <Text style={styles.roleText}>{item.role}</Text>
              </View>
              <Text style={styles.agentName} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={32} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Nenhum agente encontrado
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  searchBox: {
    flexDirection: "row", alignItems: "center",
    borderRadius: 12, borderWidth: 1,
    paddingHorizontal: 12, height: 44, gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", outlineStyle: "none" },
  row: { gap: 10, marginBottom: 10 },
  agentCard: {
    flex: 1, height: 200, borderRadius: 14,
    overflow: "hidden", position: "relative",
  },
  agentOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.30)",
  },
  agentIconBubble: {
    position: "absolute", top: 18, right: 12,
    width: 64, height: 64, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
  },
  agentInfo: { position: "absolute", bottom: 12, left: 12, right: 12 },
  roleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6, marginBottom: 6,
  },
  roleText: { color: "#fff", fontSize: 10, fontFamily: "Inter_500Medium" },
  agentName: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
