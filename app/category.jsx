import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ValorantCard } from "../components/ValorantCard";
import { BackButton } from "../components/BackButton";
import { categories } from "../data/categories";
import { getCategoryData } from "../services/valorantApi";
import { getFirstValidImage, getNestedValue } from "../services/helpers";

export default function CategoryScreen() {
  const { key } = useLocalSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const category = useMemo(
    () => categories.find((item) => item.key === key),
    [key]
  );

  useEffect(() => {
    async function loadData() {
      if (!category) {
        setErro("Categoria não encontrada.");
        setLoading(false);
        return;
      }

      try {
        const data = await getCategoryData(category.endpoint);

        const filteredData = data.filter((item) => {
          const image = getFirstValidImage(item, category.imageFieldPriority);
          const title = getNestedValue(item, category.titleField);
          return !!title || !!image;
        });

        setItems(filteredData);
      } catch (error) {
        console.log("Erro ao buscar categoria:", error);
        setErro("Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [category]);

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
      <Text style={styles.title}>{category?.title}</Text>

      <FlatList
        data={items}
        keyExtractor={(item, index) =>
          item.uuid || item.displayName || item.titleText || String(index)
        }
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          const image = getFirstValidImage(item, category.imageFieldPriority);
          const title = getNestedValue(item, category.titleField) || "Sem nome";
          const subtitle = category.subtitleField
            ? getNestedValue(item, category.subtitleField)
            : null;

          return (
            <ValorantCard
              title={title}
              image={image}
              subtitle={subtitle}
              onPress={() => {
                if (category.key === "weapons") {
                  router.push({
                    pathname: "/weapon-detail",
                    params: {
                      uuid: item.uuid,
                      title,
                      image: image || "",
                    },
                  });
                  return;
                }

                if (category.key === "agents") {
                  router.push({
                    pathname: "/agent-detail",
                    params: {
                      title,
                      image: image || "",
                      role: item.role?.displayName || "",
                      description: item.description || "",
                    },
                  });
                  return;
                }

                router.push({
                  pathname: "/detalhe",
                  params: {
                    title,
                    subtitle: subtitle || "",
                    image: image || "",
                  },
                });
              }}
            />
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum item encontrado nesta categoria.
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
