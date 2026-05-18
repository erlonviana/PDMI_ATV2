import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Consulta DDD",
          headerStyle: { backgroundColor: '#6C63FF' },
          headerTintColor: '#FFFFFF',
        }} 
      />
      <Stack.Screen 
        name="ddd/[codigo]" 
        options={{ 
          title: "Resultado da Consulta",
          headerBackTitle: "Voltar",
        }} 
      />
    </Stack>
  );
}