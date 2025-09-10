"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [character, setCharacter] = useState("runner");
  const playHref = `/game?c=${encodeURIComponent(character)}`;
  
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-bg-base">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Mountain Silhouette */}
        <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-bg-dark to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-bg-medium to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-bg-light to-transparent"></div>
        
        {/* Additional Mountain Details */}
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-gradient-to-t from-bg-dark to-transparent transform -skew-x-12"></div>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-gradient-to-t from-bg-medium to-transparent transform skew-x-12"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* Logo and Title Section */}
        <div className="text-center mb-16 animate-slide-in">
          <div className="relative inline-block animate-float">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-primary opacity-20 blur-xl rounded-lg animate-pulse-glow"></div>
            <h1 className="relative text-7xl md:text-8xl font-black tracking-wider text-primary-light drop-shadow-2xl animate-glow" 
                style={{
                  fontFamily: 'Daydream, system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
                }}>
              BOWLER&apos;S
            </h1>
          </div>
          <div className="mt-4 animate-scale-in" style={{animationDelay: '0.3s'}}>
            <h2 className="text-4xl md:text-5xl font-black tracking-widest text-secondary-light drop-shadow-xl"
                style={{
                  fontFamily: 'Daydream, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
                  textShadow: '0 0 15px #c8b9ea'
                }}>
              BOULDERS
            </h2>
          </div>
          <div className="mt-8 animate-slide-in" style={{animationDelay: '0.6s'}}>
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
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { id: "runner", name: "RUNNER", desc: "Fast & Agile", color: "#22c55e" },
                { id: "rogue", name: "ROGUE", desc: "Stealthy", color: "#8b5cf6" },
                { id: "tank", name: "TANK", desc: "Heavy & Strong", color: "#f59e0b" }
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
                    <div className={`w-12 h-12 mx-auto mb-2 rounded-full border-2 ${
                      character === char.id ? 'border-primary' : 'border-border'
                    }`} style={{backgroundColor: char.color}}></div>
                    <div className="text-sm font-bold text-primary-light mb-1 font-bowler-subtext">
                      {char.name}
                    </div>
                    <div className="text-xs text-accent font-bowler-subtext">{char.desc}</div>
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
        <div className="flex flex-col sm:flex-row gap-6 mb-12 animate-slide-in" style={{animationDelay: '1.2s'}}>
          <Link 
            href={playHref} 
            className="group relative px-12 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl font-daydream cursor-pointer border-2 border-primary-light animate-pulse-glow"
            style={{
              textShadow: '0 0 10px #ffffff',
              animation: 'pulse-glow 1s ease-in-out infinite'
            }}
          >
            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 rounded-xl blur-lg transition-opacity duration-300"></div>
            <span className="relative z-10">🎮 PLAY NOW</span>
          </Link>
          
          <Link 
            href="/game" 
            className="group relative px-12 py-4 border-2 border-primary text-primary-light hover:bg-bg-medium rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 font-daydream"
            style={{
              textShadow: '0 0 10px #e8e1f3'
            }}
          >
            <span className="relative z-10">⚡ QUICK START</span>
          </Link>
        </div>

        {/* Instructions */}
        <div className="text-center animate-slide-in" style={{animationDelay: '1.5s'}}>
          <div className="bg-bg-dark border border-border rounded-lg px-8 py-4 inline-block">
            <p className="text-lg font-bold text-secondary-light font-bowler-subtext"
               style={{
                 textShadow: '0 0 8px #c8b9ea'
               }}>
              🚀 SPACE to Jump • ⬆️⬇️ to Climb • 🎯 Reach the Top!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
