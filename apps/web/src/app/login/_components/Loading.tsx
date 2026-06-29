import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { LoginState } from "../_hooks/useLogin";

interface Props {
  state: LoginState;
}

export default function Loading({ state }: Props) {
  if (state.status !== "loading") return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/50">
      <LoadingSpinner />
    </div>
  );
}
