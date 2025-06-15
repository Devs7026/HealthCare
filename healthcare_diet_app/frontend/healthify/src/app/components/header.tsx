import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full flex justify-center overflow-visible relative pt-1 pb-2 bg-black">
      <div className="relative -mt-7">
        {/* Glowing effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-green-700 via-blue-400 to-purple-400 blur-2xl opacity-80 animate-pulse"></div>
          {/* Icon Circle */}
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 p-1">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center shadow-2xl">
                    <Image
                    src="/healthify_icon.png"
                    alt="Healthify Icon"
                    width={56}
                    height={56}
                    className="z-10"
                  />
            </div>
        </div>
      </div>
    </header>
  );
}
