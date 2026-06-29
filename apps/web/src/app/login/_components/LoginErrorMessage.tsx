import { LoginState } from "../_hooks/useLogin";

interface Props {
  state: LoginState;
}

export default function LoginErrorMessage({ state }: Props) {
  if (state.status !== "error") return null;
  return (
    <p className="text-red-400 text-[0.8125rem] text-center mb-2.75">
      {state.message}
    </p>
  );
}
