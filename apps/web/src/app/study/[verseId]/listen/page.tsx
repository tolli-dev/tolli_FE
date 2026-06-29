import { getVerse, getTodayCompletionCount } from '@firebasegen/default-connector';
import { dataConnect } from '@/lib/dataconnect';
import { getLocalMidnight } from '@/lib/date';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import ListenView from './_components/ListenView';

interface ListenPageProps {
  params: Promise<{ verseId: string }>;
}

export default async function ListenPage({ params }: ListenPageProps) {
  const { verseId: verseIdParam } = await params;
  const verseId = Number(verseIdParam);

  const cookieStore = await cookies();
  const tzCookie = cookieStore.get('user-timezone')?.value;
  const today = getLocalMidnight(tzCookie || 'Asia/Seoul');

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
