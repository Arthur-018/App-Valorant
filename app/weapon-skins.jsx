import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ValorantCard } from "../components/ValorantCard";
import { BackButton } from "../components/BackButton";
import { getCategoryData } from "../services/valorantApi";

export default function WeaponSkinsScreen() {
  const { uuid, title } = useLocalSearchParams();
  const [skins, setSkins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function loadWeaponSkins() {
      try {
        const weapons = await getCategoryData("weapons");

        const selectedWeapon = weapons.find((weapon) => weapon.uuid === uuid);

        if (!selectedWeapon) {
          setErro("Arma não encontrada.");
          return;
        }

        const validSkins = (selectedWeapon.skins || []).filter(
          (skin) => skin.displayName && (skin.displayIcon || skin.wallpaper)
        );

        setSkins(validSkins);
      } catch (error) {
        console.log("Erro ao carregar skins:", error);
        setErro("Não foi possível carregar as skins.");
      } finally {
        setLoading(false);
      }
    }

    loadWeaponSkins();
  }, [uuid]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <BackButton />
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.loadingContainer}>
        <BackButton />
        <Text style={styles.feedbackText}>{erro}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Skins da {title}</Text>

      <FlatList
        data={skins}
        keyExtractor={(item, index) => item.uuid || String(index)}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <ValorantCard
            title={item.displayName}
            image={item.displayIcon || item.wallpaper}
            subtitle={null}
            onPress={() =>
              router.push({
                pathname: "/detalhe",
                params: {
                  title: item.displayName,
                  subtitle: "",
                  image: item.displayIcon || item.wallpaper || "",
                },
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhuma skin encontrada para essa arma.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#791212",
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#791212",
    justifyContent: "center",
    padding: 20,
  },
  feedbackText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  emptyText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 40,
    fontSize: 15,
  },
});
