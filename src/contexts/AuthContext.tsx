'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '@/lib/firebase';
import { 
  signInWithRedirect, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut, 
  User,
  getRedirectResult
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';

export type UserRole = 'reporter' | 'journalist' | 'official';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  signInWithGoogle: (intendedRole?: UserRole) => Promise<void>;
  signInWithFacebook: (intendedRole?: UserRole) => Promise<void>;
  loginWithEmail: (email: string, password: string, intendedRole?: UserRole) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string, intendedRole?: UserRole) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('reporter');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for redirect results (if they used Google/FB redirect)
    getRedirectResult(auth).then(async (result) => {
      if (result?.user) {
        // If we stored intended role in localStorage before redirect
        const savedRole = localStorage.getItem('intendedRole') as UserRole || 'reporter';
        await handleDatabaseUser(result.user, savedRole);
        router.push(`/dashboard/${savedRole}`);
      }
    }).catch(console.error);

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setRole(userDoc.data().role as UserRole);
        } else {
          await setDoc(userDocRef, {
            email: currentUser.email,
            name: currentUser.displayName || currentUser.email,
            role: 'reporter',
            createdAt: new Date()
          });
          setRole('reporter');
        }
      } else {
        setRole('reporter');
        if (pathname?.startsWith('/dashboard')) {
          router.push('/');
        }
      }
      
      setLoading(false);
    });
    return unsubscribe;
  }, [pathname, router]);

  const handleDatabaseUser = async (currentUser: User, targetRole: UserRole) => {
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      await updateDoc(userDocRef, { role: targetRole });
    } else {
      await setDoc(userDocRef, {
        email: currentUser.email,
        name: currentUser.displayName || currentUser.email,
        role: targetRole,
        createdAt: new Date()
      });
    }
    setRole(targetRole);
  };

  const signInWithGoogle = async (intendedRole?: UserRole) => {
    const targetRole = intendedRole || 'reporter';
    localStorage.setItem('intendedRole', targetRole);
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider); // Single window flow
  };

  const signInWithFacebook = async (intendedRole?: UserRole) => {
    const targetRole = intendedRole || 'reporter';
    localStorage.setItem('intendedRole', targetRole);
    const provider = new FacebookAuthProvider();
    await signInWithRedirect(auth, provider); // Single window flow
  };

  const loginWithEmail = async (email: string, password: string, intendedRole?: UserRole) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const targetRole = intendedRole || 'reporter';
    await handleDatabaseUser(result.user, targetRole);
    router.push(`/dashboard/${targetRole}`);
  };

  const registerWithEmail = async (email: string, password: string, name: string, intendedRole?: UserRole) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const targetRole = intendedRole || 'reporter';
    
    // Update Firebase Auth Profile
    import('firebase/auth').then(({ updateProfile }) => {
      updateProfile(result.user, { displayName: name }).catch(console.error);
    });

    // Update Firestore Document directly to ensure name is saved immediately
    const userDocRef = doc(db, 'users', result.user.uid);
    await setDoc(userDocRef, {
      email: result.user.email,
      name: name,
      role: targetRole,
      createdAt: new Date()
    });
    
    setRole(targetRole);
    router.push(`/dashboard/${targetRole}`);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ 
      user, role, setRole, 
      signInWithGoogle, signInWithFacebook, 
      loginWithEmail, registerWithEmail, resetPassword, 
      signOut, loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
