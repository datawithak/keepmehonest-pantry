import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { PantryItem } from '../types';
import { Colors } from '../constants/colors';

interface Props {
  item: PantryItem;
  onToggle: (item: PantryItem) => void;
  onDelete: (item: PantryItem) => void;
}

export function PantryItemRow({ item, onToggle, onDelete }: Props) {
  const handleLongPress = () => {
    Alert.alert(
      'Delete Item',
      `Remove "${item.name}" from pantry?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(item) },
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={() => onToggle(item)}
      onLongPress={handleLongPress}
      activeOpacity={0.6}
      style={styles.row}
    >
      <View style={[styles.checkbox, item.struckOut && styles.checkboxChecked]}>
        {item.struckOut && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, item.struckOut && styles.struck]}>
          {item.name}
        </Text>
        {item.quantity ? (
          <Text style={[styles.qty, item.struckOut && styles.struck]}>
            {item.quantity}
          </Text>
        ) : null}
      </View>
      {item.struckOut && item.struckBy && (
        <Text style={styles.struckBy}>by {item.struckBy}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: Colors.terracotta,
    borderColor: Colors.terracotta,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    color: Colors.charcoal,
  },
  qty: {
    fontSize: 13,
    color: Colors.charcoal,
    marginTop: 2,
  },
  struck: {
    textDecorationLine: 'line-through',
    color: Colors.struck,
  },
  struckBy: {
    fontSize: 12,
    color: Colors.charcoal,
    fontStyle: 'italic',
  },
});
