Monastery360
============

Run locally
-----------

1. Copy `.env.example` to `.env` and fill Firebase web config:

   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start in dev (auto-restart):

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`.

Build & Deploy
--------------

- Production start:

  ```bash
  npm run start
  ```

Notes
-----

- The server injects Firebase config into `public/index.html` at runtime by replacing `__FIREBASE_CONFIG__`.
- 360° viewer uses Pannellum via CDN. Sample tour is available under Virtual Tours.
- For sharper 360s, generate multires tiles and point scenes to them:

  1. Install pannellum tools (Python):

     ```bash
     pip install pannellum
     ```

  2. Generate tiles from a high-res equirectangular (e.g., 8k or 12k):

     ```bash
     python -m pannellum.tile "C:/path/to/your/pano.jpg" --output "public/tiles/yourpano" --levels 1 2 3 4 5
     ```

  3. Configure a scene in `public/index.html` using `type: 'multires'`:

     ```js
     { type: 'multires', multiRes: { basePath: '/tiles/yourpano', path: '/%l/%s%y_%x', extension: 'jpg', tileResolution: 512, maxLevel: 5, cubeResolution: 4096 } }
     ```

  4. Replace sample scenes in `sampleTourData.images` with objects that include `type: 'multires'` and the `multiRes` config above for each panorama.

  This streams higher-res tiles progressively and prevents blurry rendering.

