import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'nur_user_profile_v1';

interface StoredUserProfile {
  name: string;
  hasAccount: boolean;
  email?: string;
  isPremium: boolean;
}

interface UserContextValue {
  isLoaded: boolean;
  name: string;
  hasAccount: boolean;
  email: string | null;
  isPremium: boolean;
  saveName: (name: string) => Promise<void>;
  createAccount: (email: string) => Promise<void>;
  setPremium: (isPremium: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [name, setName] = useState('');
  const [hasAccount, setHasAccount] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [isPremium, setIsPremiumState] = useState(false);

  const persist = useCallback(async (next: StoredUserProfile) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: Partial<StoredUserProfile> = JSON.parse(raw);
          setName((parsed.name ?? '').trim());
          setHasAccount(Boolean(parsed.hasAccount));
          setEmail(parsed.email ? String(parsed.email) : null);
          setIsPremiumState(Boolean(parsed.isPremium));
        }
      } catch {}
      setIsLoaded(true);
    }
    load();
  }, []);

  const saveName = useCallback(async (nextName: string) => {
    const sanitized = nextName.trim();
    setName(sanitized);
    await persist({ name: sanitized, hasAccount, email: email ?? undefined, isPremium });
  }, [email, hasAccount, isPremium, persist]);

  const createAccount = useCallback(async (nextEmail: string) => {
    const sanitized = nextEmail.trim().toLowerCase();
    setHasAccount(true);
    setEmail(sanitized);
    await persist({ name, hasAccount: true, email: sanitized, isPremium });
  }, [isPremium, name, persist]);

  const setPremium = useCallback(async (nextIsPremium: boolean) => {
    setIsPremiumState(nextIsPremium);
    await persist({ name, hasAccount, email: email ?? undefined, isPremium: nextIsPremium });
  }, [email, hasAccount, name, persist]);

  const signOut = useCallback(async () => {
    setHasAccount(false);
    setEmail(null);
    setIsPremiumState(false);
    await persist({ name, hasAccount: false, email: undefined, isPremium: false });
  }, [name, persist]);

  const value = useMemo<UserContextValue>(() => ({
    isLoaded,
    name,
    hasAccount,
    email,
    isPremium,
    saveName,
    createAccount,
    setPremium,
    signOut,
  }), [createAccount, email, hasAccount, isLoaded, isPremium, name, saveName, setPremium, signOut]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
