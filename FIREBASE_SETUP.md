# Firebase Setup Guide

This guide will help you configure Firebase Authentication and Firestore for your Free Fire Quiz application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter your project name (e.g., "ff-diamond-quizify")
4. Follow the setup wizard to create your project

## Step 2: Enable Authentication

1. In your Firebase project, go to **Build** → **Authentication**
2. Click **Get Started**
3. Enable the following sign-in methods:
   - **Email/Password**: Toggle on
   - **Google**: Toggle on and configure with your support email
   - **Anonymous**: Toggle on (Required for Free Fire ID authentication)

## Step 3: Create Firestore Database

1. Go to **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (or test mode for development)
4. Select your Cloud Firestore location
5. Click **Enable**

## Step 4: Set Up Firestore Rules

In Firestore Database → **Rules**, paste the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Allow users to read and write their own document
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow authenticated users to read other users' data (for leaderboards, etc.)
      allow read: if request.auth != null;
    }
    
    // Quiz results collection (if you want to track quiz attempts)
    match /quizResults/{resultId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

Click **Publish** to apply the rules.

## Step 5: Get Your Firebase Configuration

1. In your Firebase project, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "Web App")
5. Copy the `firebaseConfig` object

## Step 6: Configure Environment Variables

1. Create a `.env` file in your project root (it's already in `.gitignore`)
2. Add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

3. Replace the values with your actual Firebase config values

## Step 7: Run Your Application

```bash
# Install dependencies (if you haven't already)
npm install

# Start the development server
npm run dev
```

## Features Enabled

✅ **Free Fire ID Authentication**
- Users can sign up and log in using their Free Fire ID and region
- Free Fire ID is verified with external API
- API response is stored in user document

✅ **Email/Password Authentication**
- Users can sign up with email and password
- Users can log in with existing credentials
- Password strength validation

✅ **Google Authentication**
- One-click sign in with Google account
- Automatic profile creation

✅ **User Profile Management**
- Display user information (name, email, avatar)
- Track quiz statistics
- Track total coins earned
- Show account creation date

✅ **Protected Routes**
- Profile page requires authentication
- Automatic redirect to login if not authenticated

✅ **User Interface**
- User avatar dropdown menu in navbar
- Login/Signup pages with beautiful UI
- Profile page with user stats
- Logout functionality

## User Data Structure

Each user document in Firestore contains:

```typescript
{
  uid: string;              // Firebase user ID
  email: string | null;    // User email (null for Free Fire users)
  displayName: string;     // User's display name
  photoURL: string | null; // Profile photo URL (from Google)
  freeFireId?: string;     // Free Fire player ID (for Free Fire auth)
  region?: string;         // Free Fire region (for Free Fire auth)
  freeFireData?: object;   // Complete API response from Free Fire verification
  createdAt: string;       // Account creation timestamp
  totalCoins: number;      // Total coins earned
  quizzesCompleted: number; // Number of quizzes completed
}
```

## Testing

1. Start your development server: `npm run dev`
2. Navigate to the Login page
3. Create a new account or sign in with Google
4. Check your Firestore console to see the user document created
5. Navigate to Profile page to see your user details

## Troubleshooting

### Authentication Errors

- **Invalid API key**: Double-check your `.env` file has the correct `VITE_FIREBASE_API_KEY`
- **Domain not authorized**: In Firebase Console → Authentication → Settings → Authorized domains, add `localhost`

### Firestore Permission Denied

- Check your Firestore Rules are correctly set up
- Make sure you're authenticated before trying to access user data
- Verify the user ID in the document path matches the authenticated user's ID

### Environment Variables Not Loading

- Make sure your `.env` file is in the project root
- Restart your development server after adding/changing `.env` variables
- Vite requires variables to start with `VITE_` prefix

## Additional Features You Can Add

- **Email Verification**: Require users to verify their email
- **Password Reset**: Allow users to reset forgotten passwords
- **Profile Editing**: Let users update their display name and photo
- **Leaderboards**: Show top users by coins or quizzes completed
- **Quiz History**: Track individual quiz attempts and scores
- **Social Features**: Add friends, share scores, etc.

## Security Best Practices

1. ✅ Never commit your `.env` file to version control
2. ✅ Use Firestore Security Rules to protect user data
3. ✅ Validate user input on both client and server
4. ✅ Use Firebase Admin SDK for server-side operations
5. ✅ Enable App Check to protect against abuse

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Firebase configuration
3. Review Firestore rules
4. Check Firebase Console for authentication issues
5. Make sure all Firebase services are enabled

---

**Note**: Make sure to keep your Firebase credentials secure and never expose them in public repositories!


