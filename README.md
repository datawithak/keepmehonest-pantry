# Zuby's Pantry

My husband has a talent for not finding things in the pantry and buying duplicates. We end up with 3 jars of pasta sauce, one of which expires before we get to it. Wasted food, wasted money, and wasted space (fellow New Yorkers know how precious that is).

Zuby's Pantry is a shared app for two: we track what's in the pantry, cross things off as we use them, and neither of us goes grocery shopping blind again.

---

## How it works

One person creates a pantry and gets a 6-character code. The other enters it to join. From that point, both phones share the same live pantry board via Firestore. Add items with a category. When you use something, strike it off. Your partner sees it instantly. When someone runs something out, the other gets a push notification.

---

## Features

- Shared pantry between two people via a 6-character join code
- Real-time sync across both devices (Firestore snapshot listeners)
- 12 emoji-based categories: dals, grains, spices, oils, snacks, and more
- Strike items as used with who used it and when
- Push notification to your partner when you use something up
- Expandable category sections with active item counts
- No account needed: just a name and a code

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React Native (Expo) |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| Database | Firebase Firestore (real-time) |
| Notifications | Expo Notifications + Expo Push API |
| Local storage | AsyncStorage (user session) |

---

## Architecture

```
Firebase Firestore
  pantries/{code}
    ├── members/{id}   # name, pushToken, joinedAt
    └── items/{id}     # name, qty, category, struckOut, struckBy, struckAt

        ↓ onSnapshot() listeners
  usePantryItems hook
  · Subscribes to real-time item updates
  · Groups items by category
  · Computes active counts per category

        ↓
  UI: CategorySection + PantryItemRow
  · Expandable grouped list
  · Strike / delete actions
  · Instant sync across both devices
```

---

## Project structure

```
zubys-pantry/
├── app/
│   ├── index.tsx          # Landing screen
│   ├── setup.tsx          # Create or join pantry
│   ├── join.tsx           # Enter 6-char code
│   └── (pantry)/
│       ├── index.tsx      # Main pantry board
│       └── add-item.tsx   # Add item with category
└── src/
    ├── components/        # CategorySection, PantryItemRow
    ├── constants/         # colors, categories (12 types)
    ├── hooks/             # usePantryItems (groups by category)
    └── services/          # pantry-service, notification-service, user-service
```

---

## Running locally

The repo includes a working Firebase config connected to a live Firestore backend, so you can run it as-is:

```bash
npm install
npx expo start
```

To run your own isolated instance (recommended if you want your own pantry):
1. Create a free Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore and replace the config in `src/config/firebase.ts`
3. Set Firestore rules to allow read/write for your use case
