import { useEffect, useState } from "react";
import { ActivityIndicator,  FlatList, StyleSheet, View } from "react-native";
import ValorantCard from "../components/ValorantCard";



export default function Home() {
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(true);

    async function buscarDados() {
        try{
      const response = await fetch("https://valorant-api.com/v1/agents");
      const json = await response.json();
       
      setDados(json.data);
     } catch (error){
        console.log("Erro ao buscar API:", error);
     } finally {
        setLoading(false);
     }
    }

    useEffect(() => {
        buscarDados();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFF"/>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList 
            data={dados}
            keyExtractor={(item) => item.uuid}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.row}
             renderItem={({ item }) => (
                <ValorantCard
                tittle={item.displayName}
                image={item.displayIcon}
                subtitle={item.role?.displayName}
             onPress={() =>
              router.push({
                pathname: "/detalhe",
                params: { id: item.uuid },
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
        backgroundColor: '#791212',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#791212',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    }
})