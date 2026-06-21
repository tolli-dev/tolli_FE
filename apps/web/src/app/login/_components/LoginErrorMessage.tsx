interface Props {
  error: string | null;
}

export default function LoginErrorMessage({ error }: Props) {
  if (!error) return null;
  return (
    <p className="text-red-400 text-[13px] text-center mb-2.75">
      {error}
    </p>
  );
}
