import Image from "next/image";

interface Props {
  src: string;
}

export default function Illustration({ src }: Props) {
  return (
    <Image
      src={src}
      alt="dashboard_home_image"
      width={288}
      height={288}
      className="
            w-[clamp(12rem,55vw,18rem)]
            h-[clamp(12rem,55vw,18rem)]
          "
    />
  );
}
