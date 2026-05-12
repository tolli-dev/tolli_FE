'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { fireAuth } from '@/firebase/fireAuth';
import { useRouter } from 'next/navigation';
import LoginPage from "./login/page";

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState<{
    uid: string;
    email: string | null;
    displayName: string | null;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireAuth, (u) => {
      if (u) setUser({ uid: u.uid, email: u.email, displayName: u.displayName });
      else router.push('/login');
    });
    return () => unsubscribe();
  }, []);

  if (!user) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p>uid: {user.uid}</p>
      <p>email: {user.email}</p>
      <p>name: {user.displayName}</p>
      <button
        type="button"
        onClick={() => {
          signOut(fireAuth);
        }}
      >
        로그아웃
      </button>
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <LoginPage />
    </div>
  );
}
