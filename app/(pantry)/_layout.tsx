import { Stack } from 'expo-router';
import { Colors } from '../../src/constants/colors';

export default function PantryLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.cream },
        headerTintColor: Colors.charcoal,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: Colors.cream },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Zuby's Pantry", headerBackVisible: false }}
      />
      <Stack.Screen
        name="add-item"
        options={{
          title: 'Add Item',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
