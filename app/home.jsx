import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { ValorantCard } from "../components/ValorantCard";
import { MenuCard } from "../components/MenuCard";

export default function HomeScreen() {
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscarAgent() {
      try {
        const response = await fetch("https://valorant-api.com/v1/agents");
        const json = await response.json();

        const primeiroValido = json.data.find(
          (item) => item.isPlayableCharacter && item.displayIcon
        );

        setAgent(primeiroValido);
      } catch (error) {
        console.log("Erro ao buscar agent:", error);
      } finally {
        setLoading(false);
      }
    }

    buscarAgent();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!agent) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MenuCard
          title="Agentes"
          onPress={() => router.push("/agents")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#791212",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  content : {

  }
});