"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const GameCanvas = dynamic(() => import("@/components/GameCanvas"), { ssr: false });

function GameInner() {
  const params = useSearchParams();
  const selectedCharacter = params.get("c");
  return (
    <div className="w-full h-[100dvh]">
      <GameCanvas selectedCharacter={selectedCharacter} />
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div className="w-full h-[100dvh]" />}>
      <GameInner />
    </Suspense>
  );
}


