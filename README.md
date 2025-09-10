Bowler's Boulders — Phaser + Next.js

Stack
- **Runtime**: Next.js (App Router, TypeScript), Vercel deploy
- **Game**: Phaser 3 (Arcade Physics)
- **Styling**: Tailwind CSS

Local development
```bash
npm run dev
```
Open http://localhost:3000 and click Play, or go to `/game`.

Project structure
- `src/app` — Next.js routes. `/game` renders the Phaser canvas.
- `src/components/GameCanvas.tsx` — SSR-safe client component creating the Phaser game.
- `src/game/scenes/*` — Phaser scenes: Boot, Preload, Game, UI.

Adding your own art and audio
- Put assets in `public/assets/...`.
- Update `PreloadScene` loaders, e.g. `this.load.image("player", "/assets/player.png")`.
- For animations, add spritesheets and `this.anims.create({...})` once during preload.

Deployment (Vercel)
1. Push to GitHub.
2. Import the repo in Vercel. Framework preset: Next.js.
3. Build command: `next build` (default). Output directory: `.next`.

Game notes
- Overlap with any boulder ends the run; score is time survived.
- Difficulty ramps by reducing spawn intervals over time.
- Character selection is passed as `?c=runner|rogue|tank` to `/game`.
