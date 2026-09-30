# ThreeUI fit for the portfolio

## Finding

Some ThreeUI pieces could fit, especially the Work section and small DOM controls. The existing app is React 18.2, React Three Fiber 8, and Three.js r170; it already has a lazy-loaded, demand-rendered R3F desk scene and a separate text portfolio. The ThreeUI pages describe several different runtimes, so the site’s claim that a piece is “for React” does not establish that it can be dropped into this R3F scene unchanged.

## Best fits

- **Work & Case Studies — Volta Atelier:** ThreeUI’s catalog describes six illustrated projects in a scroll-driven fanned stack, with an active-project rail, keyboard navigation, and configurable links ([catalog entry](https://threeui.com/sections/work/section-volta-atelier-work), also listed on the [ThreeUI homepage](https://threeui.com/)). This maps well to the existing Projects section and its project-link data. It is the clearest candidate to evaluate for the text view; the dedicated page did not load in the browser used for this research, so the catalog description is the available evidence.
- **Mail / Play circle buttons:** Both are explicitly labeled DOM + CSS ([Mail](https://threeui.com/buttons/circle-buttons/mail), [Play](https://threeui.com/buttons/circle-buttons/play)). They are more likely to adapt to the existing HTML navigation/footer than to the WebGL canvas. Mail could suit a contact action; Play would need an actual media or demo action to justify it.
- **Brand Orbs:** These are labeled Canvas 2D; the catalog includes React and GitHub variants ([DesignCode orb](https://threeui.com/ui-elements/brand-orbs/designcode)). They could decorate a skills or links area, though their animated canvas adds work and visual weight to an already information-dense portfolio.
- **Spotlight Laptop:** This is described as local Three.js r170 with GLSL and static image textures ([asset page](https://threeui.com/3d-assets/motion-design/spotlight-laptop)), matching the project’s Three.js version. Treat it as source to port into the existing R3F canvas, not as proven drop-in React/R3F code. The current scene already loads a local laptop model and is deliberately demand-rendered, so this is a weaker fit unless replacing or substantially upgrading that object.

## Integration and access limits

ThreeUI’s [installation page](https://threeui.com/installation) names `@designcodeio/threeui`, shared styles, peer requirements, and a first interactive Three.js component. Its content is dynamically loaded and the browser reader exposed only that summary; exact exports, peer ranges, component props, asset paths, and installation instructions could not be verified here. A package metadata lookup also failed because registry DNS was unavailable (`EAI_AGAIN`). Do not assume compatibility with React 18 / R3F 8 from the package name or the Spotlight page’s Three r170 runtime alone. Check the package metadata and each selected component’s source/install notes before adding dependencies or wiring it into the app.

The [pricing page](https://threeui.com/pricing) advertises ThreeUI Pro at $299 lifetime or $199/year, with source and commercial use. This confirms a paid commercial-use option; it does not establish free-use rights or the license terms for a particular item. Confirm the selected component’s access and license before copying source or assets into the portfolio.

## Recommendation

Prototype the Volta work section against the existing `projects` data and inspect its actual source/API and license first. Consider a DOM/CSS mail action as a smaller alternative. Defer the 3D asset unless the source can be integrated into the existing R3F canvas without adding another renderer or continuous animation loop. No ThreeUI package or component was installed as part of this research.
