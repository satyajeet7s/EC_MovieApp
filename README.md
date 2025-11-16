# CMA – Movie App

A modern React Native + Expo movie browsing application featuring watchlists, reviews, animations, profile analytics, and local authentication. Built with a scalable architecture using Expo Router, Redux Toolkit, and NativeWind.

## ✨ Features

- 🔍 **Movie Discovery** — Trending, Popular, and High-Rated titles
- 🎥 **Movie Details** — Backdrop, cast, genres, ratings & more
- ⭐ **Watchlist** — Add / remove favorite movies
- 📝 **Reviews** — Write, edit, and view reviews with star ratings
- 👤 **Local Authentication** — Sign-up / Login (AsyncStorage)
- 📊 **Profile Dashboard** — Genre stats, watch count, activity graphs
- 🎨 **Smooth Animations** — Shared Element + Reanimated
- 💾 **Persistent Storage** — User data saved on device
- 📱 **Responsive UI** — Styled using Tailwind via NativeWind

## ✨ Bonus Points
Reanimated shared element transition for movie posters
Pagination or infinite scroll
SVG chart with animated transitions


## 🚀 Setup Instructions

1. **Clone the project**
   ```bash
   git clone <your-repo-url>
   cd CMA
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment variables**  
   Create a `.env` file in the project root:
   ```env
   API_KEY=Bearer <YOUR_TMDB_API_TOKEN>
   ```
   
   The key is loaded via `app.config.js`:
   ```js
   extra: {
     apiKey: process.env.API_KEY,
   }
   ```

4. **Run the app**
   ```bash
   npm start
   # or
   yarn start
   ```
   
   Press:
   - `i` → iOS Simulator
   - `a` → Android Emulator
   - Or scan the QR with Expo Go

## 📦 Tech Stack and Libraries used

### Core
- React Native
- Expo
- Expo Router

### State & Storage
- Redux Toolkit
- React Redux
- AsyncStorage

### Networking
- Axios

### Styling
- NativeWind (Tailwind)
- Expo Linear Gradient
- Expo Vector Icons

### Animation
- React Native Reanimated
- react-native-shared-element
- Lottie

### Graphics
- react-native-svg

### Tools
- TypeScript
- ESLint
- Babel (via Expo)

## 🏗️ Project Architecture

```
app/
├── (auth)/                # Login & Signup
├── (main)/                # Main app (tabs)
│   ├── screens/           # Home, Favorites, Profile
│   ├── services/          # API + business logic
│   └── _layout.tsx        # Tab navigator layout
├── components/            # Reusable UI components
├── api/                   # TMDB API logic
├── data/                  # Static data & fallback
└── _layout.tsx            # Root navigation

store/
├── authSlice.ts
├── favoriteSlice.ts
└── index.ts

constants/
├── Colors.ts
├── strings.ts
└── apiConstants/
```

## 🔄 Data Flow Overview

```
TMDB API → Services →  UI Components → Whistlisted →  AsyncStorage+Redux store (Persistence)
```

### Auth Slice
- `isAuthenticated`
- `user`
- `loading`

### Favorite Slice
- `favoriteIds`
- `favoriteList`

## 🎨 Design System

- Dark & modern UI
- Tailwind utility classes via NativeWind
- Smooth card animations and shared-element transitions
- Responsive layouts for multiple screen sizes



## 🤝 Thanks for this Challenge Opportunity