"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [character, setCharacter] = useState("runner");
  const playHref = `/game?c=${encodeURIComponent(character)}`;
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-10 text-center">
        <div className="space-y-3">
          <h1 className="text-5xl font-semibold tracking-tight">Bowler&apos;s Boulders</h1>
          <p className="text-base text-[#c8b9ea]">Dodge rolling boulders. Climb to the top.</p>
        </div>
        <div className="w-full max-w-md mx-auto space-y-4 text-left">
          <label className="block text-sm text-[#c8b9ea]">Select character</label>
          <select
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
            className="w-full rounded px-3 py-2 bg-[#281b3f] text-[#e8e1f3] outline-none focus:ring-2 focus:ring-[#5b3fb6]"
          >
            <option className="bg-[#281b3f]" value="runner">Runner</option>
            <option className="bg-[#281b3f]" value="rogue">Rogue</option>
            <option className="bg-[#281b3f]" value="tank">Tank</option>
          </select>
        </div>
        <div className="space-x-3">
          <Link href={playHref} className="inline-block bg-[#5b3fb6] hover:bg-[#493391] text-white px-6 py-3 rounded transition-colors">
            Play
          </Link>
          <Link href="/game" className="inline-block border border-[#5b3fb6] text-[#e8e1f3] px-6 py-3 rounded hover:bg-[#281b3f]">
            Quick Start
          </Link>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-[#a998d8]">Press Space to jump. Up/Down to climb.</p>
        </div>
      </div>
    </div>
  );
}
