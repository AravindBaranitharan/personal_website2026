# brag-output — product loops

Silent 5s loops for the Services and Work cards, made with the `/brag-slim` method from
[latent-spaces/brag](https://github.com/latent-spaces/brag). See `brag-plan.md` for the storyboards.

## Make a scene

1. Copy `scenes/figma-to-code-agent.html` as the pattern: a `.stage` (`stage--night|paper|band|pink|wash`)
   holding one `#content` wrapper; `window.SCENE = { duration: 5, poster: <seconds>, render(t) }`.
2. `render(t)` sets every animated style from `t` alone (use `B.seg`, `B.ease`, `B.css`, `B.typed`, `B.outro`).
   Start from the empty ground at t=0 and fade `#content` out over the last 0.5s so the loop is seamless.
3. 1440×900, nothing readable under 26px (the card shows it at ~40% size). Site fonts and tokens are in `common.css`.

## Render

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9555 \
  --user-data-dir=/tmp/brag-chrome --allow-file-access-from-files --hide-scrollbars about:blank &
node brag-output/render.mjs [slug ...]     # CDP_PORT=… to use another Chrome
```

Writes `public/videos/<slug>.mp4` (H.264, no audio) and `<slug>.jpg` (poster). Frames go to `work/` (git-ignored).
