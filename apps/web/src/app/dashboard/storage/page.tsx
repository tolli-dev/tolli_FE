import StorageView from "./_components/StorageView";

export default async function StoragePage({
  searchParams,
}: {
  searchParams: Promise<{ isDone?: string }>;
}) {
  const { isDone } = await searchParams;
  const done = isDone === "true";

  return <StorageView done={done} />;
}
