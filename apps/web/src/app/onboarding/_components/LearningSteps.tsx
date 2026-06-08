const STEPS = [
  { label: '읽기', borderColor: '#574F6D', lineColor: '#574F6D' },
  { label: '가려짐', borderColor: '#706189', lineColor: '#706189' },
  { label: '기억', borderColor: '#A996C7', lineColor: '#A996C7' },
  { label: '말하기', borderColor: '#CCB5F0', lineColor: '#CCB5F0' },
];

const numStyle = {
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
  letterSpacing: '-0.07em',
};

const labelStyle = {
  fontSize: '1.25rem',
  lineHeight: '1.25rem',
  letterSpacing: '-0.07em',
  fontWeight: 600,
};

export default function LearningSteps() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center w-full">
        {STEPS.map(({ label }, i) => (
          <div key={label} className="flex flex-1 justify-center">
            <span style={numStyle} className="text-primary-50">
              {i + 1}
            </span>
          </div>
        ))}
      </div>

      <div className="relative flex items-center w-full">
        <div
          className="absolute top-1/2 -translate-y-1/2 h-px"
          style={{
            left: '12.5%',
            right: '12.5%',
            background: `linear-gradient(to right, #574F6D, #574F6D 33%, #706189 33%, #706189 66%, #A996C7 66%, #A996C7 100%)`,
          }}
        />
        {STEPS.map(({ label, borderColor }) => (
          <div key={label} className="relative flex flex-1 justify-center">
            <div
              style={{ border: `1px solid ${borderColor}`, ...labelStyle }}
              className="px-3 py-2 rounded-[10px] bg-surface-400 text-primary-50 whitespace-nowrap"
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
