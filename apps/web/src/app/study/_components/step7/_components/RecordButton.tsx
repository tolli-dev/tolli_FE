import { Icon } from "@iconify/react";

export default function RecordButton({
  recordIcon,
  description,
  handleRecord,
}: {
  recordIcon: string;
  description: string;
  handleRecord: () => void;
}) {
  return (
    <>
      <button
        onClick={handleRecord}
        className="shrink-0 bg-[#CCB5F0] rounded-[1.25rem] items-center justify-center 
        flex flex-row py-3.25 gap-1.5 mb-6.5"
      >
        <Icon icon={`${recordIcon}`} className="text-[#000000] size-6" />
        <span className="font-semibold text-[1rem] leading-[1.425rem] text-[#1B1B1B]">
          {description}
        </span>
      </button>
    </>
  );
}
