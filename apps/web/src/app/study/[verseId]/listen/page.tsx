'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getVerse, getTodayCompletionCount } from '@firebasegen/default-connector';
import { dataConnect } from '@/lib/dataconnect';
import ListenView from './_components/ListenView';

export default function ListenVerse() {
  const [verseText, setVerseText] = useState('');
  const [reference, setReference] = useState('');
  const [todayCount, setTodayCount] = useState(0);
  const { verseId: verseIdParam } = useParams<{ verseId: string }>();
  const verseId = Number(verseIdParam);

  useEffect(() => {
    if (!verseId) return;
    getVerse(dataConnect, { id: verseId }).then((result) => {
      const verse = result.data.verse;
      if (!verse) return;
      setVerseText(verse.fullText);
      setReference(verse.reference);
    });
  }, [verseId]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    getTodayCompletionCount(dataConnect, { today: today.toISOString() }).then((result) => {
      setTodayCount(result.data.studyCompletions.length);
    });
  }, []);

  return (
    <ListenView
      verseId={verseId}
      verseText={verseText}
      reference={reference}
      todayCount={todayCount}
    />
  );
}
