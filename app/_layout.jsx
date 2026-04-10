import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="home" />
      <Stack.Screen name="category" />
      <Stack.Screen name="detalhe" />
      <Stack.Screen name="agent-detail" />
      <Stack.Screen name="weapon-detail" />
      <Stack.Screen name="weapon-skins" />
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastro" />
    </Stack>
  );
}
