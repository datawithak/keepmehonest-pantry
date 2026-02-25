import { Stack } from 'expo-router';
import { Colors } from '../src/constants/colors';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.cream },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="setup" options={{ headerShown: true, title: 'Get Started', headerStyle: { backgroundColor: Colors.cream }, headerTintColor: Colors.charcoal }} />
      <Stack.Screen name="join" options={{ headerShown: true, title: 'Join Pantry', headerStyle: { backgroundColor: Colors.cream }, headerTintColor: Colors.charcoal }} />
      <Stack.Screen name="(pantry)" />
    </Stack>
  );
}
