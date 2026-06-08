import StorageView from "./_components/StorageView";

export default async function StoragePage({
  searchParams,
}: {
  searchParams: Promise<{ isDone?: string; nickname?: string }>;
}) {
  const { isDone, nickname } = await searchParams;
  const done = isDone === "true";

  return <StorageView done={done} nickname={nickname} />;
}
