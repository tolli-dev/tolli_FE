import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Props {
  loading: boolean;
}

export default function Loading({ loading }: Props) {
  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/50">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
}
