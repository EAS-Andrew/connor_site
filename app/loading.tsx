import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen bg-stealth-black flex items-center justify-center">
      <div className="animate-logo-breathe">
        <Image
          src="/logo.svg"
          alt="StealthShield"
          width={80}
          height={85}
          priority
        />
      </div>
    </div>
  );
}
