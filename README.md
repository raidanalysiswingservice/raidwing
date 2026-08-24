# Raid Analysis Wing — Website

React + Firebase (Firestore, Auth) + Cloudinary. Public-records-office design:
warm paper, deep ink, brass accents, serif headings, monospace reference numbers.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
```

## 1. Firebase setup (Console)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.
2. Build → **Authentication** → *Get started* → **Email/Password** → enable.
3. Build → **Firestore Database** → *Create database* → choose a location → **Start in production mode**.
4. Project settings (gear) → **General** → *Your apps* → **`</>` Web app** → register → copy the
   `firebaseConfig` values into `src/constants.ts` (`FIREBASE_CONFIG`) or a `.env` file (see `.env.example`).
5. **Create the admin account**:
   - Authentication → Users → **Add user** → email + password you will log in with.
   - Copy that user's **UID** and paste it into `src/constants.ts` → `ADMIN_UID`.
   - Also paste it into `firestore.rules` (replace `PASTE_YOUR_ADMIN_UID`), then
     Firestore Database → **Rules** → publish the updated rules.

## 2. Cloudinary setup (images)

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. **Settings → Upload** → *Unsigned upload presets* → **Add preset**:
   - Preset name: `raw_unsigned` (or any name)
   - Signing mode: **Unsigned**
   - Folder: optional (the app sends its own folders)
3. Paste your **cloud name** and **upload preset name** into `src/constants.ts`
   (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_UPLOAD_PRESET`) or `.env`.

> Using an unsigned preset means anyone with the cloud name could upload
> images; acceptable for this scale, but note it.

## 3. Admin portal

- Footer → **Portal Login** → email + password of the Firebase user created in step 1.5.
- Only the account whose UID equals `ADMIN_UID` is admitted.
- Admin panel: `Dashboard · Applications · Messages · Team · Officers · RAW Corner · Gallery · Hero Images`.

## Data model (Firestore collections)

| Collection     | Purpose                                  | Public access |
| -------------- | ---------------------------------------- | ------------- |
| `applications` | Join Us form submissions + uploaded proofs | submit only  |
| `messages`     | Contact form submissions                 | submit only  |
| `team`         | Team members (name, role, photo)         | read         |
| `officers`     | Officer ID verification records          | read         |
| `news`         | RAW Corner notices (title, link, image)  | read         |
| `gallery`      | Gallery photographs (image, title)       | read         |
| `heroImages`   | Homepage hero image (one marked `active`) | read        |

## File map

```
src/
  constants.ts            ← admin UID, Firebase config, Cloudinary config, nav
  lib/firebase.ts         Firebase init (null when unconfigured)
  lib/cloudinary.ts       upload + display-URL helpers
  lib/useCollection.ts    live Firestore subscription hooks
  components/             Navbar (with dropdowns), Footer (portal login), Layout, Ui
  pages/                  Home, About, Services, Join, RAW Corner, Team,
                          Verify Officer, Gallery, Contact, Login
  pages/admin/            Admin panel (dashboard + 7 manager sections)
firestore.rules           Security rules (paste your UID, publish in console)
```