import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "../components/Button/index";
import { router } from "expo-router";


export default function Cadastro() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    function handleCadastro() {
        if (!nome || !email || !senha) {
            Alert.alert("Erro", "Preencha todos os campos.");
            return;
        }

        Alert.alert("Sucesso", "Conta criada com sucesso!");
        router.replace("/login");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}> Criar Conta </Text>

            <TextInput
                style={styles.input}
                placeholder="Digite seu nome"
                placeholderTextColor="#999"
                value={nome}
                onChangeText={setNome}
            />

            <TextInput
                style={styles.input}
                placeholder="Digite seu email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
            style={styles.input}
            placeholder="Crie uma senha"
            placeholderTextColor="#999"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            />

            <Button title="Criar conta" onPress={handleCadastro} />

            <Text style={styles.link} onPress={() => router.push("/login")}>
                Já tem conta? Entrar
            </Text>

        </View>

    )
}

const styles = StyleSheet.create ({ 
    container: {
        flex: 1,
        backgroundColor: "#791212",
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 32,
        color: "#FFF",
        textAlign: "center",
        marginBottom: 30,
        fontWeight: "bold",
    },
    input: {
        width: "100%",
        backgroundColor: "#FFF",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 12,
    },
    link: {
        marginTop: 20,
        color: "#FFF",
        textAlign: "center",
        textDecorationLine: "underline",
    },
});