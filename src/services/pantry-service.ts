import {
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { PantryItem, PantryMember } from '../types';

// Generate a random 6-character alphanumeric code
export function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 to avoid confusion
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Create a new pantry
export async function createPantry(code: string, createdBy: string): Promise<void> {
  await setDoc(doc(db, 'pantries', code), {
    code,
    createdAt: Date.now(),
    createdBy,
  });
}

// Check if a pantry exists
export async function pantryExists(code: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'pantries', code));
  return snap.exists();
}

// Add a member to the pantry
export async function addMember(
  code: string,
  name: string,
  pushToken: string
): Promise<void> {
  // Use push token as doc ID if available, otherwise use name
  const docId = pushToken || name.replace(/\s+/g, '-').toLowerCase();
  await setDoc(doc(db, 'pantries', code, 'members', docId), {
    name,
    pushToken,
    joinedAt: Date.now(),
  } as PantryMember);
}

// Get all members of a pantry
export function onMembersSnapshot(
  code: string,
  callback: (members: PantryMember[]) => void
): Unsubscribe {
  const ref = collection(db, 'pantries', code, 'members');
  return onSnapshot(ref, (snapshot) => {
    const members: PantryMember[] = [];
    snapshot.forEach((doc) => members.push(doc.data() as PantryMember));
    callback(members);
  });
}

// Add an item to the pantry
export async function addItem(
  code: string,
  item: Omit<PantryItem, 'id'>
): Promise<string> {
  const ref = await addDoc(collection(db, 'pantries', code, 'items'), item);
  return ref.id;
}

// Toggle strike-out on an item
export async function toggleStrikeItem(
  code: string,
  itemId: string,
  struckOut: boolean,
  struckBy: string | null
): Promise<void> {
  await updateDoc(doc(db, 'pantries', code, 'items', itemId), {
    struckOut,
    struckBy: struckOut ? struckBy : null,
    struckAt: struckOut ? Date.now() : null,
  });
}

// Delete an item
export async function deleteItem(code: string, itemId: string): Promise<void> {
  await deleteDoc(doc(db, 'pantries', code, 'items', itemId));
}

// Real-time listener for all items in a pantry
export function onItemsSnapshot(
  code: string,
  callback: (items: PantryItem[]) => void
): Unsubscribe {
  const ref = collection(db, 'pantries', code, 'items');
  return onSnapshot(
    ref,
    (snapshot) => {
      const items: PantryItem[] = [];
      snapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as PantryItem);
      });
      // Sort client-side to avoid needing a Firestore index
      items.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
      callback(items);
    },
    (error) => {
      console.warn('Firestore snapshot error:', error);
      callback([]);
    }
  );
}
