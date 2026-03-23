import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { ValorantCard } from "../components/ValorantCard";

export default function AgentsScreen() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscarAgents() {
      try {
        const response = await fetch("https://valorant-api.com/v1/agents");
        const json = await response.json();

        const agentsValidos = json.data.filter((item) => {
          const image =
            item.fullPortrait ||
            item.fullPortraitV2 ||
            item.bustPortrait ||
            item.displayIcon;

          return item.isPlayableCharacter && image;
        });

        setAgents(agentsValidos);
      } catch (error) {
        console.log("Erro ao buscar agents:", error);
        setErro("Não foi possível carregar os agentes.");
      } finally {
        setLoading(false);
      }
    }

    buscarAgents();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.feedbackText}>{erro}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={agents}
        keyExtractor={(item) => item.uuid}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          const image =
            item.fullPortrait ||
            item.fullPortraitV2 ||
            item.bustPortrait ||
            item.displayIcon;

          return (
            <ValorantCard
              title={item.displayName}
              image={image}
              subtitle={item.role?.displayName || "Sem função"}
              onPress={() =>
                router.push({
                  pathname: "/detalhe",
                  params: {
                    id: item.uuid,
                    nome: item.displayName,
                    funcao: item.role?.displayName || "Sem função",
                  },
                })
              }
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#791212",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#791212",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  feedbackText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
});