export interface Category {
  key: string;
  label: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { key: 'dals', label: 'Dals & Lentils', emoji: '🫘' },
  { key: 'grains', label: 'Rice & Grains', emoji: '🍚' },
  { key: 'spices', label: 'Spices & Masalas', emoji: '🌶️' },
  { key: 'oils', label: 'Oils & Ghee', emoji: '🫗' },
  { key: 'canned', label: 'Canned & Packaged', emoji: '🥫' },
  { key: 'snacks', label: 'Snacks & Dry Munchies', emoji: '🍿' },
  { key: 'dryfruits', label: 'Dry Fruits & Nuts', emoji: '🥜' },
  { key: 'beverages', label: 'Tea, Coffee & Beverages', emoji: '☕' },
  { key: 'condiments', label: 'Condiments & Sauces', emoji: '🫙' },
  { key: 'essentials', label: 'Essentials', emoji: '🧂' },
  { key: 'household', label: 'Cleaning & Household', emoji: '🧹' },
  { key: 'sweets', label: 'Sweets', emoji: '🍬' },
];
