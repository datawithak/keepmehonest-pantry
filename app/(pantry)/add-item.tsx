import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/colors';
import { CATEGORIES } from '../../src/constants/categories';
import { addItem } from '../../src/services/pantry-service';
import { getUser } from '../../src/services/user-service';

export default function AddItemScreen() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; pantryCode: string } | null>(null);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('other');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  const handleAdd = async () => {
    if (!name.trim()) {
      Alert.alert('Enter an item name');
      return;
    }
    if (!user) return;
    setLoading(true);
    try {
      await addItem(user.pantryCode, {
        name: name.trim(),
        quantity: quantity.trim(),
        category: selectedCategory,
        struckOut: false,
        struckBy: null,
        struckAt: null,
        addedBy: user.name,
        addedAt: Date.now(),
      });
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/watermark-bg.jpg')}
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{ opacity: 0.25 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.label}>Item Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Olive Oil"
            placeholderTextColor={Colors.muted}
            value={name}
            onChangeText={setName}
            autoFocus
          />

          <Text style={styles.label}>Quantity (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 2 bottles"
            placeholderTextColor={Colors.muted}
            value={quantity}
            onChangeText={setQuantity}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.categories}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.catChip,
                  selectedCategory === cat.key && styles.catChipSelected,
                ]}
                onPress={() => setSelectedCategory(cat.key)}
              >
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
                <Text
                  style={[
                    styles.catLabel,
                    selectedCategory === cat.key && styles.catLabelSelected,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={handleAdd}
            disabled={loading}
          >
            <Text style={styles.addBtnText}>
              {loading ? 'Adding...' : 'Add to Pantry'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  content: {
    padding: 24,
    paddingBottom: 60,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.charcoal,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    color: Colors.charcoal,
    backgroundColor: Colors.white,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  catChipSelected: {
    borderColor: Colors.terracotta,
    backgroundColor: '#E8E3E5',
  },
  catEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  catLabel: {
    fontSize: 14,
    color: Colors.charcoal,
  },
  catLabelSelected: {
    color: Colors.terracotta,
    fontWeight: '600',
  },
  addBtn: {
    marginTop: 32,
    backgroundColor: Colors.terracotta,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addBtnText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
});
