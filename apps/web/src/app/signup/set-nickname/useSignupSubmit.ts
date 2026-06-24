'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { createUser, deleteUser } from '@firebasegen/default-connector';
import { dataConnect } from '@/lib/dataconnect';
import { fireAuth } from '@/firebase/fireAuth';
import posthog from 'posthog-js';

async function getIdToken(): Promise<string | null> {
  if (fireAuth.currentUser) {
    return fireAuth.currentUser.getIdToken().catch(() => null);
  }
  return new Promise<string | null>((resolve) => {
    const unsub = onAuthStateChanged(fireAuth, (user) => {
      unsub();
      if (user) {
        user.getIdToken().then(resolve).catch(() => resolve(null));
      } else {
        resolve(null);
      }
    });
  });
}

export function useSignupSubmit(name: string, isValid: boolean) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [userError, setUserError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    setNicknameError(null);
    setUserError(null);

    const termsAgreedAt = sessionStorage.getItem('termsAgreedAt') ?? '';
    const privacyAgreedAt = sessionStorage.getItem('privacyAgreedAt') ?? '';
    const emailMarketingAgreed = sessionStorage.getItem('emailMarketingAgreed') === 'true';
    const emailMarketingAgreedAt = sessionStorage.getItem('emailMarketingAgreedAt') || null;

    const idToken = await getIdToken();

    if (!idToken) {
      setLoading(false);
      setUserError('로그인 정보를 불러오지 못했어요. 다시 시도해주세요.');
      return;
    }

    try {
      await createUser(dataConnect, {
        nickname: name,
        termsAgreedAt,
        privacyAgreedAt,
        emailMarketingAgreed,
        emailMarketingAgreedAt,
      });
    } catch (error) {
      setLoading(false);
      console.error('닉네임 설정 오류', error);
      setNicknameError('닉네임 설정 중 오류가 발생했어요. 다시 시도해주세요.');
      return;
    }

    posthog.capture('signup_complete', { email_marketing_agreed: emailMarketingAgreed });

    try {
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
    } catch (error) {
      try {
        await deleteUser(dataConnect);
      } catch (rollbackError) {
        console.error('삭제 실패', rollbackError);
      }
      setLoading(false);
      console.error(`${error} 유저 생성 실패`);
      setUserError('유저 생성 중 오류가 발생했어요. 다시 시도해주세요.');
      return;
    }

    sessionStorage.removeItem('termsAgreedAt');
    sessionStorage.removeItem('privacyAgreedAt');
    sessionStorage.removeItem('emailMarketingAgreed');
    sessionStorage.removeItem('emailMarketingAgreedAt');

    router.push(`/signup/greeting/${encodeURIComponent(name)}`);
  };

  const handleUserError = () => {
    setUserError(null);
    router.push('/login');
  };

  return { loading, nicknameError, userError, handleSubmit, handleUserError };
}
