# Product loops — plan

Short silent loops for the Services and Work StackCards, made with the `/brag-slim` workflow from
[latent-spaces/brag](https://github.com/latent-spaces/brag): every frame is a pure function of time,
drawn in a browser, captured frame by frame and encoded with FFmpeg.

Adapted from brag's 20s launch-video defaults to what the site needs:

- **5.0s per loop, 30fps, 1440×900 (16:10), no audio** — they autoplay muted inside cards.
- **Seamless loop:** each scene starts on its empty ground and fades back to it in the last ~0.5s.
- **Readable at card size** (~560px wide on desktop, so ×0.4): no UI text under 26px, labels short.
- **Palette and type from the site:** Host Grotesk / Fragment Mono, paper/band/night grounds, pinks.
- **Shape per loop:** entry → key action → result, one idea each. No invented numbers; the only
  figures shown are the resume's (60%, 50–70%, 90→15 min). Names and data on screen are fictional.

## Storyboards

### Work · figma-to-code-agent (night ground)
1. 0.0–0.7 Figma-style frame slides in on the left: layers panel (Hero, Title, Button, Card) + a small pink app design.
2. 0.7–1.6 A pink selection box steps through the layers; each layer row lights up as it's selected.
3. 1.4–3.0 Agent chips across the top light in turn: Parser → Planner → Coder → Reviewer. A code panel on the right types JSX.
4. 2.8–4.0 A browser preview assembles the same screen block by block; a "Screen ready" toast lands.
5. 4.0–4.5 Hold. 4.5–5.0 Fade to ground.

### Work · rag-test-case-generator (pink ground)
Requirements doc → highlighted passages are chunked into a vector index (dots cluster) → re-ranked
passages feed a local model chip ("Mistral · on-prem") → test cases type out as a checklist with ✓ →
a "−60% manual effort" stat lands.

### Work · mark-bot (wash ground)
Content-agency board: a reel card travels across stages (Topic → Script → Shoot → Edit → Publish);
at Script, an LLM writes a Tanglish reel script line by line; at Publish an invoice chip ticks
"Billed on delivery"; ends on "Ops sync 90 → 15 min".

### Services · ai-llm-integrations (surface/white ground)
A question bubble → documents fan out → top-3 passages re-rank (bars reorder) → grounded answer with
citation chips [1][2] → an eval score meter fills ("faithfulness").

### Services · agent-systems (night ground)
An orchestrator node pulses; three agent nodes (Research, Code, Review) spawn; messages travel along
edges (A2A); an MCP tool panel shows the tools appearing inside an editor sidebar ("Cursor").

### Services · custom-web-apps (surface/white ground)
A browser window: wireframe boxes snap into real components (nav, hero, cards), an AI search box
types a query and returns results, a Lighthouse-style ring fills.

### Services · saas-product-build (night ground)
Sign-in → role-based dashboard assembles (sidebar, KPI tiles, chart line draws) → a billing card
switches plan and a "Paid" badge appears.
