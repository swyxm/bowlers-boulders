"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Button from "@/components/Button";

// Mountain silhouette function
const getMountainHeight = (x: number, width: number): number => {
  const normalizedX = x / width;
  
  // Create smooth mountain shapes with slight jitter
  const mainPeak = Math.sin(normalizedX * Math.PI * 1.5); // Main mountain shape
  const subPeak = Math.sin(normalizedX * Math.PI * 3 + 0.5) * 0.4; // Secondary peaks
  
  // Add slight jitter for pixelated feel
  const jitterSize = 20;
  const jitterX = Math.floor(normalizedX * width / jitterSize) * jitterSize / width;
  const jitter = Math.sin(jitterX * Math.PI * 12) * 0.1; // Small random variation
  
  // Combine for smooth diagonals with jitter
  const combinedHeight = mainPeak + subPeak + jitter;
  
  // Map to screen coordinates: valleys at 85%, peaks at 40%
  const valleyHeight = 0.85;  // Bottom valleys
  const peakHeight = 0.4;     // Tall peaks
  const heightRange = valleyHeight - peakHeight; // 0.45 range
  
  // Convert from -1 to 1 range to valley-peak range
  const normalizedHeight = (combinedHeight + 1) / 2; // Convert to 0-1
  return peakHeight + (1 - normalizedHeight) * heightRange;
};

// Mountain dots component
const MountainDots = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const dotSize = 2;
    const spacing = 6;
    
    // Draw dots
    for (let x = 0; x < canvas.width; x += spacing) {
      for (let y = 0; y < canvas.height; y += spacing) {
        const mountainHeight = getMountainHeight(x, canvas.width);
        const normalizedY = y / canvas.height;
        
        let color = '#613df2'; // Lighter background purple
        
        // If we're below the mountain line, make dots darker (single depth)
        if (normalizedY > mountainHeight) {
          color = '#39219c'; // Single mountain color
        }
        
        ctx.fillStyle = color;
        ctx.fillRect(x, y, dotSize, dotSize);
      }
    }
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 opacity-50"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default function Home() {
  const [character, setCharacter] = useState("archer");
  const playHref = `/game?c=${encodeURIComponent(character)}`;
  
  useEffect(() => {
    const audio = new Audio('/assets/bowlingmusic.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch(console.error);
    
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);
  
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-bg-base">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Mountain silhouette using positioned dots */}
        <MountainDots />
        
        {/* Subtle glow effects */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-400/15 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        <div className="text-center mb-16 animate-slide-in">
          <div className="relative inline-block">
            <div className="absolute -inset-10 rounded-xl opacity-40 blur-2xl animate-svg-glow-color" />
            <div className="relative">
              <Image
                src="/assets/bowlersboulders.svg"
                alt="Bowler's Boulders"
                width={800}
                height={250}
                className="w-auto h-36 md:h-54 object-contain logo-glow"
                style={{ }}
                priority
              />
            </div>
          </div>
          <div className="mt-4 animate-slide-in" style={{animationDelay: '0.6s'}}>
            <p className="text-xl md:text-xl font-bold text-accent tracking-wide"
               style={{
                 fontFamily: 'Daydream',
                 textShadow: '0 0 10px #a998d8'
               }}>
              DODGE • CLIMB • SURVIVE
            </p>
          </div>
        </div>

        {/* Character Selection */}
        <div className="w-full max-w-lg mx-auto mb-10 animate-scale-in" style={{animationDelay: '0.9s'}}>
          <div className="bg-bg-dark border-2 border-primary rounded-xl p-6 shadow-2xl animate-pulse-glow">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-primary-light mb-2 font-daydream"
                  style={{
                    textShadow: '0 0 10px #e8e1f3'
                  }}>
                CHOOSE YOUR HERO
              </h3>
              <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: "archer", name: "ARCHER", desc: "Swift & Precise", color: "#22c55e" },
                { id: "valk", name: "VALKYRIE", desc: "Goon Goddess", color: "#8b5cf6" },
                { id: "witch", name: "TWIN PICKED WITCH TS COMING", desc: "MILF", color: "#f59e0b" }
              ].map((char) => (
                <button
                  key={char.id}
                  onClick={() => setCharacter(char.id)}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                    character === char.id 
                      ? 'border-primary bg-bg-medium shadow-lg scale-105' 
                      : 'border-border bg-bg-dark hover:border-border-light hover:scale-102'
                  }`}
                >
                  <div className="text-center">
                    {char.id === "archer" ? (
                      <div className="mx-auto mb-2 flex items-center justify-center">
                        <Image
                          src="/assets/archericon.png"
                          alt="Archer"
                          width={48}
                          height={48}
                          className="w-18 h-18 object-contain"
                        />
                      </div>
                    ) : (
                      <div className={`w-12 h-12 mx-auto mb-2 rounded-full border-2 ${
                        character === char.id ? 'border-primary' : 'border-border'
                      }`} style={{backgroundColor: char.color}}></div>
                    )}
                    <div className="text-sm font-bold text-primary mb-1 font-bowler-subtext">
                      {char.name}
                    </div>
                    <div className="text-xs text-accent font-bowler-subtext" style={{fontSize: '8px'}}>{char.desc}</div>
                  </div>
                  {character === char.id && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mb-8 animate-slide-in" style={{animationDelay: '1.2s'}}>
          <Button href={playHref} className="w-80">
            PLAY NOW
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-center animate-slide-in" style={{animationDelay: '1.5s'}}>
          <div className="bg-bg-dark/80 border border-purple-400 rounded-lg px-8 py-4 inline-block" style={{
            background: 'linear-gradient(135deg, #3d2f7a 0%, #4a3c8b 100%)'
          }}>
            <p className="text-lg font-bold text-primary font-bowler-subtext"
               style={{
                 textShadow: '0 0 8px #e8e1f3, 2px 2px 0px #000'
               }}>
              🚀 SPACE to Jump • ⬆️⬇️ to Climb • 🎯 Reach the Top!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
