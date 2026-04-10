import { FlatList, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { MenuCard } from "../components/MenuCard";
import { categories } from "../data/categories";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.key}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <MenuCard
            title={item.title}
            onPress={() =>
              router.push({
                pathname: "/category",
                params: { key: item.key },
              })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#791212",
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
