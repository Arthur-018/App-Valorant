import { Feather } from "@expo/vector-icons";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "../components/ScreenHeader";
import { MAPS } from "../data/mock/maps";
import { useColors } from "../hooks/useColors";

export default function MapsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Mapas" />

      <FlatList
        data={MAPS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomPad + 20, gap: 12 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.mapCard, { backgroundColor: item.color }]}>
            <View style={styles.mapOverlay} />
            <Feather
              name="map"
              size={120}
              color="rgba(255,255,255,0.10)"
              style={styles.bgIcon}
            />
            <View style={styles.mapInfo}>
              <Text style={styles.mapName}>{item.name}</Text>
              <View style={styles.coordRow}>
                <Feather name="map-pin" size={11} color="rgba(255,255,255,0.7)" />
                <Text style={styles.coordText}>{item.coordinates}</Text>
              </View>
              <View style={[styles.descBadge, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
                <Text style={styles.descBadgeText}>{item.tactical}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  mapCard: {
    height: 190, borderRadius: 16,
    overflow: "hidden", position: "relative",
  },
  mapOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(15,25,35,0.45)",
  },
  bgIcon: { position: "absolute", right: -10, top: -10 },
  mapInfo: { position: "absolute", bottom: 16, left: 16, right: 16 },
  mapName: { color: "#fff", fontSize: 22, fontFamily: "Inter_700Bold", marginBottom: 6 },
  coordRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 8 },
  coordText: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "Inter_400Regular" },
  descBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  descBadgeText: { color: "#fff", fontSize: 11, fontFamily: "Inter_500Medium" },
});
