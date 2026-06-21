interface Props {
  error: string | null;
}

export default function LoginErrorMessage({ error }: Props) {
  if (!error) return null;
  return (
    <p className="text-red-400 text-[0.8125rem] text-center mb-2.75">{error}</p>
  );
}
