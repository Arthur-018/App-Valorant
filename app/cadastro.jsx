import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

export default function CadastroScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <Pressable style={styles.button} onPress={() => router.replace("/home")}>
        <Text style={styles.buttonText}>Cadastrar e entrar</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.secondary]} onPress={() => router.replace("/login")}>
        <Text style={styles.buttonText}>Já tenho conta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#791212",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#1f1f1f",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    minWidth: 200,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  secondary: {
    opacity: 0.95,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
