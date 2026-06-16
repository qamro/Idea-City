# ✦ IDEA CITY

> *A civilization built from your mind.*

Every idea becomes a building. Every project becomes a district. Every achievement becomes a monument. Idea City is a living, breathing world that grows as you grow.

---

## What it is

Idea City is not a todo app. Not a dashboard. Not a productivity tool.

It is a **personal civilization**, an infinite canvas where your ideas, skills, goals, dreams, and achievements take physical form as buildings in a city only you can build.

---

<div align="center">
 
**🌐 Live Demo: (https://idea-city.vercel.app)** 

</div>

---

## Features

- **8 Building Types** — Houses (ideas), Schools (skills), Factories (projects), Towers (goals), Pagodas (dreams), Libraries (learning), Monuments (achievements), Glass towers (business)
- **5 Building Levels** — Each building grows from a seedling to an icon landmark
- **District System** — Same-category buildings auto-cluster into glowing neighborhood zones
- **Infinite Canvas** — Drag, zoom, and explore your city like a map application
- **Day / Night Mode** — Two distinct visual atmospheres; night mode makes buildings glow
- **Cinematic Onboarding** — The first experience is magical, not a form
- **Firebase Auth** — Sign in with Google or GitHub
- **Firestore Sync** — Your city persists and syncs across devices in real time
- **Live Particle Effects** — Buildings breathe with ambient particles; achievements trigger fireworks
- **Keyboard Shortcuts** — `N` add, `T` toggle day/night, `Escape` close, `0` reset view

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, CSS Modules         |
| Animation | Framer Motion                       |
| Auth      | Firebase Authentication             |
| Database  | Cloud Firestore                     |
| Deploy    | Vercel                              |

---

## Project Structure

```
src/
├── components/
│   ├── buildings/
│   │   ├── Building.jsx          # Individual building on the canvas
│   │   ├── Building.module.css
│   │   └── buildingShapes.js     # SVG generators for all 8 types × 5 levels
│   ├── city/
│   │   ├── CityCanvas.jsx        # Infinite pan/zoom world
│   │   ├── CityCanvas.module.css
│   │   ├── Districts.jsx         # Colored district zone overlays
│   │   ├── Districts.module.css
│   │   ├── StarField.jsx         # Animated night sky canvas
│   │   └── StarField.module.css
│   ├── onboarding/
│   │   ├── Onboarding.jsx        # Cinematic first-run experience
│   │   └── Onboarding.module.css
│   └── ui/
│       ├── TopBar.jsx            # City name, stats, day/night toggle
│       ├── TopBar.module.css
│       ├── BuildingDetail.jsx    # Slide-in panel for selected building
│       ├── BuildingDetail.module.css
│       ├── AddBuildingModal.jsx  # Create new building dialog
│       ├── AddBuildingModal.module.css
│       ├── Controls.jsx          # Zoom buttons + Add FAB
│       ├── Controls.module.css
│       ├── Toast.jsx             # Notification toasts
│       └── Toast.module.css
├── context/
│   ├── AuthContext.jsx           # Firebase auth state
│   └── CityContext.jsx           # City, buildings, all actions
├── hooks/
│   ├── useCamera.js              # Pan/zoom/smooth animation
│   ├── useParticles.js           # Particle & firework effects
│   └── useToast.js               # Toast notification state
├── pages/
│   ├── LoginPage.jsx             # Cinematic auth screen
│   ├── LoginPage.module.css
│   ├── CityPage.jsx              # Main city view
│   └── CityPage.module.css
├── services/
│   ├── firebase.js               # Firebase app init
│   ├── auth.js                   # Auth methods
│   └── db.js                     # All Firestore operations
├── styles/
│   └── globals.css               # Design tokens, animations, base styles
└── utils/
    ├── constants.js              # Categories, district origins, levels
    └── helpers.js                # Position finding, stat calc, formatting
```

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/yourusername/idea-city.git
cd idea-city
npm install
```

### 2. Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Sign-in methods → Google + GitHub
4. Enable **Firestore Database** → Start in production mode
5. Copy your Firebase config

### 3. Environment variables

```bash
cp .env.example .env
```

Fill in your Firebase config values in `.env`:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 4. Firestore security rules

In Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }

    match /cities/{cityId} {
      allow read: if request.auth != null && resource.data.ownerId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.ownerId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.ownerId == request.auth.uid;

      match /buildings/{buildingId} {
        allow read, write: if request.auth != null &&
          get(/databases/$(database)/documents/cities/$(cityId)).data.ownerId == request.auth.uid;
      }

      match /districts/{districtId} {
        allow read, write: if request.auth != null &&
          get(/databases/$(database)/documents/cities/$(cityId)).data.ownerId == request.auth.uid;
      }

      match /achievements/{achievementId} {
        allow read, write: if request.auth != null &&
          get(/databases/$(database)/documents/cities/$(cityId)).data.ownerId == request.auth.uid;
      }
    }
  }
}
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

---

## Keyboard Shortcuts

| Key       | Action                  |
|-----------|-------------------------|
| `N`       | Add new building        |
| `T`       | Toggle day / night      |
| `Escape`  | Close modal / deselect  |
| `+` / `-` | Zoom in / out           |
| `0`       | Reset view              |

---

## Data Model

```
users/{uid}
  ├── uid, name, email, photoURL, createdAt

cities/{cityId}
  ├── ownerId, cityName, createdAt, population, level
  ├── buildings/{buildingId}
  │     ├── title, category, level, positionX, positionY
  │     ├── createdAt, updatedAt
  ├── districts/{districtId}
  │     ├── name, category, createdAt
  └── achievements/{achievementId}
        ├── title, description, unlockedAt
```

---

## Achievement Milestones

| Buildings | Achievement         |
|-----------|---------------------|
| 1         | First Light         |
| 5         | Village             |
| 10        | Town of Thought     |
| 25        | City of Ideas       |
| 50        | Metropolis of Mind  |
| 100       | Legendary Skyline   |


---


## 👨‍💻 Author

Developed by:

**Mohamed Qamar Eddine Bakhouche**

---

## License

**MIT** 



<div align="center">

## Build your civilisation.

</div>
