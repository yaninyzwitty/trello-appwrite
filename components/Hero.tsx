"use client";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

function Hero() {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between p-4 lg:max-w-6xl mx-auto">
      <div className="flex space-x-1">
        <Cog6ToothIcon className="h-7 w-7 text-red-400" />
        <h2 className="text-xl font-bold">Sumz</h2>
      </div>
      <button
        className="px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-md"
        onClick={() => router.push(`https://github.com/yaninyzwitty`)}
      >
        Github
      </button>
    </header>
  );
}

export default Hero;
