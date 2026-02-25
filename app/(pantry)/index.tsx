import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/colors';
import { usePantryItems } from '../../src/hooks/usePantryItems';
import { CategorySection } from '../../src/components/CategorySection';
import { PantryItem } from '../../src/types';
import { getUser } from '../../src/services/user-service';
import {
  toggleStrikeItem,
  deleteItem,
  onMembersSnapshot,
  addMember,
} from '../../src/services/pantry-service';
import { saveUser } from '../../src/services/user-service';
import { sendPushNotification } from '../../src/services/notification-service';
import { PantryMember } from '../../src/types';

export default function PantryScreen() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; pantryCode: string; pushToken?: string } | null>(null);
  const [members, setMembers] = useState<PantryMember[]>([]);

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  useEffect(() => {
    if (!user?.pantryCode) return;
    const unsub = onMembersSnapshot(user.pantryCode, setMembers);
    return () => unsub();
  }, [user?.pantryCode]);

  const { grouped, loading } = usePantryItems(user?.pantryCode ?? null);

  const handleToggle = useCallback(
    async (item: PantryItem) => {
      if (!user) return;
      const newStruckOut = !item.struckOut;
      await toggleStrikeItem(
        user.pantryCode,
        item.id,
        newStruckOut,
        user.name
      );

      // Notify the other person when something is struck out
      if (newStruckOut) {
        const otherMembers = members.filter(
          (m) => m.pushToken !== user.pushToken
        );
        for (const m of otherMembers) {
          await sendPushNotification(
            m.pushToken,
            "Zuby's Pantry",
            `${user.name} used up: ${item.name}`
          );
        }
      }
    },
    [user, members]
  );

  const handleDelete = useCallback(
    async (item: PantryItem) => {
      if (!user) return;
      await deleteItem(user.pantryCode, item.id);
    },
    [user]
  );

  const handleEditName = () => {
    if (!user) return;
    Alert.prompt(
      'Edit Name',
      'Enter your new name:',
      async (newName) => {
        if (!newName?.trim()) return;
        const updated = { ...user, name: newName.trim() };
        await saveUser(updated);
        await addMember(user.pantryCode, newName.trim(), user.pushToken || '');
        setUser(updated);
      },
      'plain-text',
      user.name
    );
  };

  // Fallback for Android (Alert.prompt is iOS only)
  const handleEditNameAndroid = () => {
    if (!user) return;
    // Use a simple approach with Alert + state
    setEditingName(true);
  };

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  const submitNameEdit = async () => {
    if (!user || !newName.trim()) {
      setEditingName(false);
      return;
    }
    const updated = { ...user, name: newName.trim() };
    await saveUser(updated);
    await addMember(user.pantryCode, newName.trim(), user.pushToken || '');
    setUser(updated);
    setEditingName(false);
  };

  if (!user || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.terracotta} />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/watermark-bg.jpg')}
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{ opacity: 0.25 }}
    >
      <View style={styles.codeBar}>
        <Text style={styles.codeLabel}>Pantry Code: </Text>
        <Text style={styles.codeValue}>{user.pantryCode}</Text>
        <TouchableOpacity
          onPress={() => {
            setNewName(user.name);
            setEditingName(true);
          }}
          style={styles.nameBtn}
        >
          <Text style={styles.nameText}>{user.name} ✎</Text>
        </TouchableOpacity>
      </View>

      {editingName && (
        <View style={styles.editBar}>
          <TextInput
            style={styles.editInput}
            value={newName}
            onChangeText={setNewName}
            autoFocus
            placeholder="New name"
          />
          <TouchableOpacity onPress={submitNameEdit} style={styles.editSave}>
            <Text style={styles.editSaveText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setEditingName(false)} style={styles.editCancel}>
            <Text style={styles.editCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {grouped.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🧺</Text>
          <Text style={styles.emptyText}>Your pantry is empty</Text>
          <Text style={styles.emptyHint}>Tap + to add your first item</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 100 }}>
          {grouped.map((group) => (
            <CategorySection
              key={group.key}
              group={group}
              onToggleItem={handleToggle}
              onDeleteItem={handleDelete}
            />
          ))}
        </ScrollView>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(pantry)/add-item')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cream,
  },
  codeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(250,247,242,0.95)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  codeLabel: {
    fontSize: 13,
    color: Colors.muted,
  },
  codeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.terracotta,
    letterSpacing: 2,
  },
  nameBtn: {
    marginLeft: 'auto',
  },
  nameText: {
    fontSize: 13,
    color: Colors.terracotta,
    fontWeight: '600',
  },
  editBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: Colors.charcoal,
  },
  editSave: {
    marginLeft: 8,
    backgroundColor: Colors.terracotta,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editSaveText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  editCancel: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editCancelText: {
    color: Colors.muted,
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.charcoal,
  },
  emptyHint: {
    fontSize: 15,
    color: Colors.muted,
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  fabText: {
    color: Colors.white,
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '300',
  },
});
