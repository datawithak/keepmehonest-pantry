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
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '../src/constants/colors';
import { saveUser } from '../src/services/user-service';
import {
  generateCode,
  createPantry,
  addMember,
} from '../src/services/pantry-service';
import { registerForPushNotifications } from '../src/services/notification-service';

export default function SetupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Enter your name first');
      return;
    }
    setLoading(true);
    try {
      const code = generateCode();
      await createPantry(code, name.trim());

      const pushToken = await registerForPushNotifications();
      await addMember(code, name.trim(), pushToken);

      await saveUser({ name: name.trim(), pantryCode: code, pushToken });

      Alert.alert(
        'Pantry Created!',
        `Your code is: ${code}\n\nShare this with your partner to join.`,
        [
          {
            text: 'Copy Code',
            onPress: async () => {
              await Clipboard.setStringAsync(code);
              router.replace('/(pantry)');
            },
          },
          {
            text: 'OK',
            onPress: () => router.replace('/(pantry)'),
          },
        ]
      );
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = () => {
    if (!name.trim()) {
      Alert.alert('Enter your name first');
      return;
    }
    router.push({ pathname: '/join', params: { name: name.trim() } });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.heading}>What's your name?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Anu"
          placeholderTextColor={Colors.muted}
          value={name}
          onChangeText={setName}
          autoFocus
          autoCapitalize="words"
        />

        <TouchableOpacity
          style={[styles.button, styles.createBtn]}
          onPress={handleCreate}
          disabled={loading}
        >
          <Text style={styles.createBtnText}>
            {loading ? 'Creating...' : 'Create New Pantry'}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.or}>or</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity
          style={[styles.button, styles.joinBtn]}
          onPress={handleJoin}
        >
          <Text style={styles.joinBtnText}>Join Existing Pantry</Text>
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
    marginBottom: 24,
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    color: Colors.charcoal,
    backgroundColor: Colors.white,
    marginBottom: 32,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  createBtn: {
    backgroundColor: Colors.terracotta,
  },
  createBtnText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  or: {
    marginHorizontal: 16,
    color: Colors.muted,
    fontSize: 15,
  },
  joinBtn: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.terracotta,
  },
  joinBtnText: {
    color: Colors.terracotta,
    fontSize: 17,
    fontWeight: '600',
  },
});
