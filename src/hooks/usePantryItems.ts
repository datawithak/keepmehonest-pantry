import { useEffect, useState } from 'react';
import { PantryItem } from '../types';
import { onItemsSnapshot } from '../services/pantry-service';
import { CATEGORIES } from '../constants/categories';

export interface CategoryGroup {
  key: string;
  label: string;
  emoji: string;
  items: PantryItem[];
}

export function usePantryItems(code: string | null) {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;

    const unsubscribe = onItemsSnapshot(code, (newItems) => {
      setItems(newItems);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [code]);

  // Group items by category, only include categories that have items
  const grouped: CategoryGroup[] = CATEGORIES.map((cat) => ({
    ...cat,
    items: items.filter((item) => item.category === cat.key),
  })).filter((group) => group.items.length > 0);

  return { items, grouped, loading };
}
