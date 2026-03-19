import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { Button } from "../components/Button";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    
    function handleLogin() {
        if (!email || !senha) {
            Alert.alert("Erro", "Preencha email e senha.");
            return;
        }
        Alert.alert("Sucesso", "Login realizado com sucesso!");
        router.replace("/home");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Entrar</Text>
            <TextInput 
            style={styles.input}
            placeholder="Digite seu email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            />
            <TextInput 
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#999"
            secureTextEntry
            value={senha}
            onChangeText={setSenha} />

            <Button
                title="Entrar"
                onPress={handleLogin}
            />
            <Text style={styles.link} onPress={() => router.push("/cadastro")}>
                Nâo tem conta? Criar conta
            </Text>
        </View>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#721313",
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
    marginBottom: 14,
  },
  link: {
    marginTop: 20,
    color: "#FFF",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});