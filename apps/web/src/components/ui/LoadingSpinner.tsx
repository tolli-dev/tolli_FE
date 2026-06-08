export default function LoadingSpinner() {
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
        <div
          className="w-16 h-16 rounded-full"
          style={{
            padding: '4px',
            background: 'conic-gradient(from var(--spinner-angle), white, #CCB5F0, white)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            animation: 'spinner-spin 1s linear infinite',
          }}
        />
      </div>
      <style>{`
        @property --spinner-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes spinner-spin {
          from { --spinner-angle: 0deg; }
          to { --spinner-angle: 360deg; }
        }
      `}</style>
    </>
  );
}
