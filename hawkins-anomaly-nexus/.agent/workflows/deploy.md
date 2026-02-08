---
description: How to deploy the HANex platform
---

### 1. Build Verification
Before deploying, ensure the project builds correctly locally:
```powershell
npm run build
```
Verify that the `dist` folder is created with all assets.

### 2. Deployment Options

#### Option A: Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root.
3. Follow the prompts. When asked for the output directory, ensure it is `dist`.

#### Option B: Netlify
1. Install Netlify CLI: `npm install netlify-cli -g`
2. Run `netlify deploy --prod`.
3. Select `Create & configure a new site`.
4. Set the build command to `npm run build` and publish directory to `dist`.

#### Option C: Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase init hosting`.
3. Select your Firebase project.
4. Set "public directory" to `dist`.
5. Configure as a single-page app: `Yes`.
6. Run `firebase deploy`.

### 3. Environment Variables
Ensure all Firebase configuration keys from `src/firebase.js` (if any are hardcoded or using env vars) are added to your hosting provider's dashboard:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- etc.
