import { getVerse, getTodayCompletionCount } from '@firebasegen/default-connector';
import { dataConnect } from '@/lib/dataconnect';
import { notFound } from 'next/navigation';
import ListenView from './_components/ListenView';

interface ListenPageProps {
  params: Promise<{ verseId: string }>;
}

export default async function ListenPage({ params }: ListenPageProps) {
  const { verseId: verseIdParam } = await params;
  const verseId = Number(verseIdParam);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [verseResult, countResult] = await Promise.all([
    getVerse(dataConnect, { id: verseId }),
    getTodayCompletionCount(dataConnect, { today: today.toISOString() }),
  ]);

  const verse = verseResult.data.verse;
  if (!verse) return notFound();

  const todayCount = countResult.data.studyCompletions.length;

  return (
    <ListenView
      verseId={verseId}
      verseText={verse.fullText}
      reference={verse.reference}
      todayCount={todayCount}
    />
  );
}
