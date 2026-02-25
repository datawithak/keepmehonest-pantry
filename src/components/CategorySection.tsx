import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CategoryGroup } from '../hooks/usePantryItems';
import { PantryItemRow } from './PantryItemRow';
import { PantryItem } from '../types';
import { Colors } from '../constants/colors';

interface Props {
  group: CategoryGroup;
  onToggleItem: (item: PantryItem) => void;
  onDeleteItem: (item: PantryItem) => void;
}

export function CategorySection({ group, onToggleItem, onDeleteItem }: Props) {
  const [expanded, setExpanded] = useState(true);
  const activeCount = group.items.filter((i) => !i.struckOut).length;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.header}
        activeOpacity={0.7}
      >
        <Text style={styles.emoji}>{group.emoji}</Text>
        <Text style={styles.label}>{group.label}</Text>
        <Text style={styles.count}>
          {activeCount}/{group.items.length}
        </Text>
        <Text style={styles.chevron}>{expanded ? '▾' : '▸'}</Text>
      </TouchableOpacity>
      {expanded &&
        group.items.map((item) => (
          <PantryItemRow
            key={item.id}
            item={item}
            onToggle={onToggleItem}
            onDelete={onDeleteItem}
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.cream,
  },
  emoji: {
    fontSize: 20,
    marginRight: 8,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.charcoal,
    flex: 1,
  },
  count: {
    fontSize: 14,
    color: Colors.muted,
    marginRight: 8,
  },
  chevron: {
    fontSize: 16,
    color: Colors.muted,
  },
});
