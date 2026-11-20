# Rail Builder

A lighter demo of the train engine I built for [Train of Thought](https://github.com/SimonSoliloquy/train-of-thought).

Click anywhere on an endless low-poly map to build a station there; track is laid to it from the selected station and a train starts running. Click one station, then another, to join them. Click a train to ride it. There's no money, no score and no end.

**Play:** https://simonsoliloquy.com/railbuilder/ (the old https://railbuilder.vercel.app forwards there until about 2026-12-19)

## Run it

```bash
npm install
npm run dev     # http://localhost:5184
npm test
```

## How it fits together

- `index.html` is the page; `src/main.js` handles clicks and the hints.
- `src/places.js` stands in for Wikipedia: Train of Thought's rules expect articles that link to each other, so each place you build is an "article" that links only to the stations you join it to.
- `src/free.js` runs first and makes everything cost nothing and turns off the signposts.
- `src/engine/` is the Train of Thought engine (terrain, routing, track, stations, trains, rendering), **copied** from that repo's `src/`. Don't edit it here: change the file in Train of Thought, then copy it across again with

  ```bash
  npm run sync-engine -- ../train-of-thought
  ```

## Deploy

Published as plain files on Cloudflare (Workers static assets, no Worker code; see `wrangler.jsonc`),
on the `simonsoliloquy.com/railbuilder/` route. Cloudflare's GitHub build runs `sh tools/cf-build.sh`
(which builds into `.cf/railbuilder/` with `--base=/railbuilder/`) and then `npx wrangler deploy` on
every push to `main`. By hand, with wrangler logged in:

```bash
npm run deploy   # sh tools/cf-build.sh && npx wrangler@4.40.0 deploy
```

The Vercel project `railbuilder` now only redirects every path to the new address (`vercel.json`);
it can be deleted after about 2026-12-19.

Built by [simonsoliloquy.com](https://simonsoliloquy.com).
