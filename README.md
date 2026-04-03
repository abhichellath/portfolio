# My Portfolio

Built using HTML, CSS, JavaScript and Firebase.

## Features
- Polished modern hero section and responsive layout
- Profile image with automatic fallback avatar if file is missing
- Typing animation with rotating roles
- Dynamic projects from Firebase with local fallback cards
- Contact form integration with Firebase Firestore

## Setup
1. Add your profile image as `assets/profile.jpeg` (or update the path in `index.html`).
2. Update Firebase keys in `firebase.js`.
3. Open `index.html` using a local server.

### Firebase (for contact form + project data)
Use your real Firebase web config in `firebase.js`:

```js
const firebaseConfig = {
  apiKey: "YOUR_REAL_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID"
};
```

Create Firestore collections:
- `messages` (saved from contact form)
- `projects` (shown in portfolio)

Suggested Firestore rules for testing:
```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{doc} {
      allow create: if true;
      allow read: if false;
    }
    match /projects/{doc} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## Deploy on Render
1. Push this repo to GitHub.
2. In Render, click **New +** -> **Static Site**.
3. Connect your GitHub repo.
4. Build Command: leave empty.
5. Publish Directory: `.`
6. Deploy.
7. After deploy, open the live URL and test contact form.

## Live Demo
(Your Render link here)