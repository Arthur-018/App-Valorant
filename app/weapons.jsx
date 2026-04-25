import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "../components/ScreenHeader";
import { WEAPONS } from "../data/mock/weapons";
import { useColors } from "../hooks/useColors";

const CATEGORY_COLORS = {
  Rifle: "#FF4655",
  SMG: "#00C4B4",
  Sniper: "#7B5BD2",
  Shotgun: "#F5A623",
  Heavy: "#56B847",
  Pistol: "#8B9BA8",
};

export default function WeaponsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const filtered = WEAPONS.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Armas" />

      <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Buscar arma..."
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
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomPad + 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const catColor = CATEGORY_COLORS[item.category] ?? colors.primary;
          return (
            <View style={[styles.weaponCard, { backgroundColor: colors.card }]}>
              <View style={[styles.iconBox, { backgroundColor: catColor + "22" }]}>
                <Feather name="crosshair" size={22} color={catColor} />
              </View>
              <View style={styles.weaponLeft}>
                <Text style={[styles.categoryLabel, { color: catColor }]}>
                  {item.category}
                </Text>
                <Text style={[styles.weaponName, { color: colors.foreground }]}>
                  {item.name}
                </Text>
                <View style={styles.metaRow}>
                  <Feather name="dollar-sign" size={11} color={colors.gold} />
                  <Text style={[styles.metaText, { color: colors.gold }]}>{item.cost}</Text>
                  <Text style={[styles.metaSep, { color: colors.textTertiary }]}>·</Text>
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    {item.damage} dmg
                  </Text>
                </View>
              </View>
              <Feather name="chevron-right" size={18} color={colors.textSecondary} />
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={32} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Nenhuma arma encontrada
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
  weaponCard: {
    flexDirection: "row", alignItems: "center",
    borderRadius: 14, padding: 14, gap: 12,
  },
  iconBox: {
    width: 48, height: 48, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  weaponLeft: { flex: 1, gap: 2 },
  categoryLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5 },
  weaponName: { fontSize: 16, fontFamily: "Inter_700Bold" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  metaText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  metaSep: { fontSize: 12 },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
