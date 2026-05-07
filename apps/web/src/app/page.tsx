'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { fireAuth } from '@/firebase/fireAuth';

export default function Home() {
  const [user, setUser] = useState<{
    uid: string;
    email: string | null;
    displayName: string | null;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireAuth, (u) => {
      if (u) setUser({ uid: u.uid, email: u.email, displayName: u.displayName });
      else window.location.href = '/login';
    });
    return () => unsubscribe();
  }, []);

  if (!user) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p>uid: {user.uid}</p>
      <p>email: {user.email}</p>
      <p>name: {user.displayName}</p>
    </div>
  );
}
