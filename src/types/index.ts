export interface User {
  name: string;
  pantryCode: string;
  pushToken?: string;
}

export interface PantryMember {
  name: string;
  pushToken: string;
  joinedAt: number;
}

export interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  struckOut: boolean;
  struckBy: string | null;
  struckAt: number | null;
  addedBy: string;
  addedAt: number;
}

export interface Pantry {
  code: string;
  createdAt: number;
  createdBy: string;
}
