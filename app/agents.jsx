import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { ValorantCard } from "../components/ValorantCard";
import { RoleCard } from "../components/RoleCard";

const roles = [
  {
    label: "Duelista",
    value: "Duelist",
    image:
      "https://media.valorant-api.com/gamemodes/96bd3920-4f36-d026-2b28-c683eb0bcac5/displayicon.png",
  },
  {
    label: "Controlador",
    value: "Controller",
    image:
      "https://media.valorant-api.com/gamemodes/96bd3920-4f36-d026-2b28-c683eb0bcac5/displayicon.png",
  },
  {
    label: "Sentinela",
    value: "Sentinel",
    image:
      "https://media.valorant-api.com/gamemodes/96bd3920-4f36-d026-2b28-c683eb0bcac5/displayicon.png",
  },
  {
    label: "Iniciador",
    value: "Initiator",
    image:
      "https://media.valorant-api.com/gamemodes/96bd3920-4f36-d026-2b28-c683eb0bcac5/displayicon.png",
  },
];

export default function AgentsScreen() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);

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
    if (!selectedRole) return [];

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
      {!selectedRole ? (
        <>
          <Text style={styles.title}>Funções dos Agentes</Text>

          <FlatList
            data={roles}
            keyExtractor={(item) => item.value}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => (
              <RoleCard
                title={item.label}
                image={item.image}
                onPress={() => setSelectedRole(item.value)}
              />
            )}
          />
        </>
      ) : (
        <>
          <View style={styles.header}>
            <Pressable
              onPress={() => setSelectedRole(null)}
              style={({ hovered, pressed }) => [
                styles.backButton,
                hovered && styles.backHover,
                pressed && styles.backPressed,
              ]}
            >
              <Text style={styles.backButtonText}>Voltar</Text>
            </Pressable>

            <Text style={styles.title}>
              {roles.find((role) => role.value === selectedRole)?.label}
            </Text>
          </View>

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
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#791212",
    paddingTop: 16,
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
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#1f1f1f",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  backHover: {
    opacity: 0.85,
  },
  backPressed: {
    opacity: 0.7,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
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