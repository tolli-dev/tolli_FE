'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getMyCompletions,
  createStudyCompletion,
} from '@firebasegen/default-connector';
import { dataConnect } from '@/lib/dataconnect';
import { QueryFetchPolicy } from 'firebase/data-connect';

export function useStudyComplete(verseId: number) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [bookmarkModal, setBookmarkModal] = useState(false);

  const handleComplete = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const { data } = await getMyCompletions(dataConnect, {
        fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
      });
      const isRetryMission = data.studyCompletions.some(
        (item) => item.verse.id === verseId,
      );

      if (isRetryMission) {
        router.push(`/study/${verseId}/completeRetry`);
      } else {
        await createStudyCompletion(dataConnect, { verseId });
        setBookmarkModal(true);
      }
    } catch (error) {
      console.error('학습 완료 처리 중 에러가 발생했습니다:', error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitError,
    bookmarkModal,
    handleComplete,
    clearError: () => setSubmitError(false),
  };
}
