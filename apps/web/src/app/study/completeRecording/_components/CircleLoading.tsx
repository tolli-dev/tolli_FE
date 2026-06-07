export default function CircleLoading({ component: _ }: { component: boolean }) {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none rounded-full"
        style={{
          padding: '6px',
          background: 'conic-gradient(from var(--angle), white, #CCB5F0, white)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          animation: 'border-spin 3s linear infinite',
        }}
      />
      <style>{`
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes border-spin {
          from { --angle: 0deg; }
          to { --angle: 360deg; }
        }
      `}</style>
    </>
  );
}
