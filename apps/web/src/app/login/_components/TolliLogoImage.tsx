import Image from "next/image";

export default function TolliLogoImage() {
  return (
    <Image
      src="/tolli-logo.webp"
      alt="tolli"
      width={744}
      height={744}
      className="w-46.5 object-contain animate-float mt-auto"
      priority
    />
  );
}
