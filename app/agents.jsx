import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { ValorantCard } from "../components/ValorantCard";
import { RoleCard } from "../components/RoleCard";

const roles = ["Todos", "Duelist", "Controller", "Sentinel", "Initiator"];

export default function AgentsScreen() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [selectedRole, setSelectedRole] = useState("Todos");

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

  const filteredAgents = useMemo(() => {
    if (selectedRole === "Todos") return agents;

    return agents.filter(
      (item) => item.role?.displayName === selectedRole
    );
  }, [agents, selectedRole]);

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
      <Text style={styles.title}>Agentes</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rolesContainer}
      >
        {roles.map((role) => (
          <RoleCard
            key={role}
            title={role}
            active={selectedRole === role}
            onPress={() => setSelectedRole(role)}
          />
        ))}
      </ScrollView>

      <FlatList
        data={filteredAgents}
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
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum agente encontrado para essa função.
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
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  rolesContainer: {
    paddingHorizontal: 16,
    gap: 10,
    paddingBottom: 10,
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
    paddingTop: 8,
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