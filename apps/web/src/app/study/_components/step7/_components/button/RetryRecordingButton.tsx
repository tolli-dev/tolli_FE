import { Icon } from "@iconify/react";

export default function RetryRecordingButton({
  icon,
  description,
  handleRecord,
}: {
  icon: string;
  description: string;
  handleRecord: () => void;
}) {
  return (
    <>
      <button
        onClick={handleRecord}
        className="shrink-0 rounded-[1.25rem] items-center justify-center 
        flex flex-row py-3.25 gap-1.5 mb-6.5 w-full
        border border-[#CCB5F0]
        "
      >
        <Icon icon={`${icon}`} className="text-[#CCB5F0] size-6" />
        <span className="font-semibold text-[1rem] leading-[1.425rem] text-[#CCB5F0]">
          {description}
        </span>
      </button>
    </>
  );
}
