import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../src/constants/colors';
import { saveUser } from '../src/services/user-service';
import { pantryExists, addMember } from '../src/services/pantry-service';
import { registerForPushNotifications } from '../src/services/notification-service';

export default function JoinScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length !== 6) {
      Alert.alert('Enter the 6-character code');
      return;
    }
    setLoading(true);
    try {
      const exists = await pantryExists(trimmed);
      if (!exists) {
        Alert.alert('Pantry Not Found', 'Double-check the code and try again.');
        setLoading(false);
        return;
      }

      const pushToken = await registerForPushNotifications();
      await addMember(trimmed, name!, pushToken);

      await saveUser({ name: name!, pantryCode: trimmed, pushToken });

      router.replace('/(pantry)');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.heading}>Join a Pantry</Text>
        <Text style={styles.sub}>
          Enter the 6-character code from your partner
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. K7M2P9"
          placeholderTextColor={Colors.muted}
          value={code}
          onChangeText={(t) => setCode(t.toUpperCase())}
          autoFocus
          autoCapitalize="characters"
          maxLength={6}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleJoin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Joining...' : 'Join Pantry'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.charcoal,
    marginBottom: 8,
  },
  sub: {
    fontSize: 16,
    color: Colors.muted,
    marginBottom: 24,
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 24,
    color: Colors.charcoal,
    backgroundColor: Colors.white,
    textAlign: 'center',
    letterSpacing: 8,
    fontWeight: '700',
    marginBottom: 32,
  },
  button: {
    backgroundColor: Colors.terracotta,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
});
