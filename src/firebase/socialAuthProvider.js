import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from "firebase/auth";
import { auth, db } from './config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const handleSocialAuth = async (provider, onSuccess, onError) => {
  try {
    const authProvider = provider === 'google'
      ? new GoogleAuthProvider()
      : new FacebookAuthProvider();

    // Add scopes
    authProvider.addScope('email');
    if (provider === 'google') {
      authProvider.addScope('profile');
    } else {
      authProvider.addScope('public_profile');
    }

    const result = await signInWithPopup(auth, authProvider);
    const userInfo = getAdditionalUserInfo(result);
    const user = result.user;
    const isNewUser = userInfo.isNewUser;

    // Default navigation
    let redirectPath = '/home';
    let needsProfileCompletion = false;

    // Firestore: users collection
    const userDocRef = doc(db, "users", user.uid);

    if (isNewUser) {
      await setDoc(userDocRef, {
        fullName: user.displayName || '',
        emailPhone: user.email || '',
        provider: provider === 'google' ? 'Google' : 'Facebook',
        createdAt: new Date(),
        lastLogin: new Date(),
      });
      needsProfileCompletion = true;
      redirectPath = '/signup';
    } else {
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        await setDoc(userDocRef, {
          ...userData,
          lastLogin: new Date(),
        }, { merge: true });

        if (!userData.gender) {
          needsProfileCompletion = true;
          redirectPath = '/signup';
        }
      } else {
        // Fallback creation
        await setDoc(userDocRef, {
          fullName: user.displayName || '',
          emailPhone: user.email || '',
          provider: provider === 'google' ? 'Google' : 'Facebook',
          createdAt: new Date(),
          lastLogin: new Date(),
        });
        needsProfileCompletion = true;
        redirectPath = '/signup';
      }
    }

    // 🔍 Check for report in userResults
    const reportDoc = await getDoc(doc(db, 'userResults', user.uid));
    if (reportDoc.exists()) {
      const reportData = reportDoc.data();
      if (reportData.sections || reportData.generatedReport) {
        redirectPath = '/report'; // ✅ go to report if exists
      }
    }

    // ✅ Final call to onSuccess
    onSuccess({
      user,
      needsProfileCompletion,
      redirectPath,
      provider: provider === 'google' ? 'Google' : 'Facebook'
    });

  } catch (error) {
    console.error(`${provider} auth error:`, error);
    let errorMessage = `Failed to authenticate with ${provider === 'google' ? 'Google' : 'Facebook'}.`;

    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = `Sign in was cancelled.`;
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = `An account already exists with the same email. Try another login method.`;
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = `Pop-up was blocked by your browser. Please enable pop-ups for this site.`;
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = `Sign in operation was cancelled.`;
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = `Network error. Please check your internet connection.`;
    }

    onError(errorMessage, error);
  }
};

export default handleSocialAuth;
