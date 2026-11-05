# [NUMMIO.DEV](http://NUMMIO.DEV) — PREMIUM EXPERIENCE REWORK

## Role

You are acting as a **world-class Creative Developer, Digital Art Director, Motion Designer and Senior Frontend Engineer**.

Your expertise includes:

- Award-winning interactive websites.
- Creative development with GSAP and ScrollTrigger.
- Advanced scroll-based storytelling.
- WebGL, Three.js and React Three Fiber.
- Premium typography and editorial layouts.
- Immersive digital experiences.
- Performance-oriented animation engineering.
- Modern frontend architecture.

Your mission is to **radically redesign and refactor the existing [nummio.dev](http://nummio.dev) website**.

This is not a visual polish task.

This is a complete creative rework of the website's visual composition, interaction model, motion design and user experience.

The current implementation is not meeting the expected level of visual sophistication, technological expression or interactivity.

**Your goal is to make Nummio feel like a premium, independent technology and research laboratory.**

---

# 1. Creative Vision

Nummio is an independent technology lab exploring software, intelligence, research and experimentation.

Brand statement:

**Curiosity, engineered.**

The website must communicate:

- Experimental technology.
- Computational intelligence.
- Intellectual exploration.
- Engineering precision.
- Curiosity and discovery.
- Premium digital craftsmanship.

The experience should feel like entering an advanced digital research environment.

Think of a combination of:

- The precision and restraint of Linear.
- The production quality and technological expression of Vercel.
- The sophisticated simplicity of ElevenLabs.
- The experimental creativity of Awwwards-winning websites.
- The intellectual and editorial atmosphere of contemporary research laboratories.

These are quality references, not templates to reproduce.

**Do not clone any existing website. Develop an original visual language for Nummio.**

---

# 2. Core Objective: Make the Website Feel Alive

The most important requirement is **motion**.

The user must feel that the website responds naturally to scrolling, navigation, hovering and interaction.

Scrolling should not feel like simply moving through static sections.

It should feel like progressing through a continuous visual experience.

Design the entire website around intentional motion choreography.

Examples of the desired experience:

- Elements transitioning fluidly between sections.
- Images revealing progressively as the user scrolls.
- Typography responding to scroll progress.
- Background compositions subtly evolving during navigation.
- Layers moving at different depths.
- Smooth transitions between visual chapters.
- Interactive graphical elements responding to pointer movement.
- Cinematic entrances and exits.
- Elements that appear connected through continuous motion.

However, motion must remain purposeful.

**Do not animate everything indiscriminately.**

The objective is sophisticated movement, not visual noise.

---

# 3. Mandatory Motion Stack

Use:

- GSAP.
- GSAP ScrollTrigger.
- GSAP timelines.
- GSAP Context / React integration.
- Modern CSS transitions.
- requestAnimationFrame where appropriate.

Consider using:

- GSAP ScrollSmoother, only if the installed version and project requirements support it.
- Lenis as an alternative smooth scrolling solution.
- Three.js / React Three Fiber for meaningful interactive 3D experiences.

Do not introduce multiple smooth-scrolling systems.

Prefer GSAP for complex, orchestrated animations rather than implementing them using arbitrary CSS keyframes.

Use GSAP's React integration and ensure all animations are correctly scoped and cleaned up.

Respect React lifecycle behavior, including development Strict Mode.

Do not create memory leaks, duplicate ScrollTriggers or unnecessary animation loops.

---

# 4. Motion Design System

Create a centralized motion design system.

Define reusable motion primitives and configuration for:

### Reveal animations

- Masked text reveals.
- Line-by-line headline entrances.
- Image clip-path reveals.
- Staggered content entrances.
- Progressive opacity and transform transitions.

### Scroll interactions

- Pinned sections.
- Scrubbed timelines.
- Parallax layers.
- Horizontal storytelling where appropriate.
- Scroll-driven transformations.
- Section-to-section transitions.

### Microinteractions

- Magnetic buttons.
- Animated navigation indicators.
- Hover-driven project previews.
- Interactive cards.
- Subtle cursor-reactive graphical elements.
- Refined menu transitions.

### Page transitions

Implement coherent transitions between routes when technically appropriate.

Avoid full-page reloads for internal navigation.

Use progressive transitions that communicate continuity between experiences.

### Motion tokens

Define reusable durations, easing functions and motion intensities.

Recommended starting points:

- Microinteraction: 150–250 ms.
- UI transitions: 250–450 ms.
- Major reveals: 600–1000 ms.
- Cinematic sequences: based on timeline composition.

These values are guidance, not rigid rules.

Animation timings must feel natural and deliberate.

---

# 5. Radical Visual Rework

Rebuild the website's visual hierarchy.

Avoid the typical structure of a generic SaaS landing page:

Hero → Features → Cards → About → Footer.

Instead, create a sequence of visually distinct chapters that form a coherent narrative.

Use:

- Oversized typography.
- Asymmetric layouts.
- Full-bleed imagery.
- Controlled negative space.
- Layered compositions.
- Dynamic grids.
- Sophisticated editorial typography.
- Carefully composed transitions between light and dark surfaces.
- Architectural layouts.
- Experimental graphical elements.

The result should look custom-designed, not assembled from a component library.

**Do not rely on repetitive rounded cards as the primary layout technique.**

Each section should have its own visual identity while remaining part of the same brand system.

---

# 6. Brand Preservation

The repository already contains Nummio's complete branding assets.

Before implementing anything:

1. Inspect the entire repository.
2. Identify the current architecture.
3. Read existing brand guidelines.
4. Inspect all available visual assets.
5. Inspect the design tokens.
6. Identify existing animations and interaction patterns.
7. Determine which parts can be reused and which must be rebuilt.

Preserve the established brand identity.

### Brand colors

- Graphite: #0B0F14
- Charcoal: #151B22
- Bone: #F2F1ED
- Signal: #B7FF63
- Iris: #A38CFF

### Typography

- Space Grotesk.
- Geist Mono.

### Logo

Use the existing official wordmark and symbol.

Do not recreate or replace the brand identity without justification.

The rework should elevate the existing identity, not abandon it.

---

# 7. Art Direction: Three Visual Worlds

The website must incorporate three established visual directions.

## Classical Intelligence

Ancient sculpture, classical philosophy, intellectual exploration and historical references.

Use this direction to represent thought, curiosity and the pursuit of knowledge.

Possible interactions:

- Cinematic image reveals.
- Slow, depth-based parallax.
- Typography layered over classical imagery.
- Scroll-driven transitions between sculpture and abstract geometry.
- Subtle transformations of image masks.

## Computational Forms

Particle systems, procedural geometry, mathematical structures and computational visualization.

Use this direction to represent intelligence, software and emerging technologies.

Possible interactions:

- Interactive particle fields.
- Reactive point clouds.
- Animated geometry.
- Scroll-responsive computational structures.
- Lightweight WebGL compositions.
- Generative lines and grids.

This should feel like a research visualization, not a generic animated wallpaper.

## Constructed Forms

Brutalist architecture, structural geometry, concrete, technical construction and engineered environments.

Use this direction to represent building, implementation and execution.

Possible interactions:

- Architectural image transitions.
- Structural masks.
- Geometric transformations.
- Perspective-based movement.
- Layers moving at different velocities.
- Scroll-driven spatial compositions.

These three worlds should connect into a continuous story:

**Thought → Computation → Construction.**

---

# 8. Homepage Experience

Design the homepage as an immersive narrative.

The following sections describe creative intent, not rigid layouts.

## Chapter 01 — Arrival

Create a memorable opening experience.

The hero should immediately establish Nummio as a sophisticated technology laboratory.

Headline:

**Curiosity, engineered.**

Explore an ambitious composition involving:

- Large editorial typography.
- Generative computational visuals.
- Precise technical metadata.
- Cinematic reveal choreography.
- Interactive pointer response.
- Background depth.
- Subtle grid systems.

The first viewport must feel visually distinctive.

Avoid a conventional centered headline with two buttons and a generic gradient background.

Consider a short, non-blocking introductory sequence.

Do not build a long loading screen.

## Chapter 02 — Curiosity

Introduce the intellectual foundation of Nummio.

Use Classical Intelligence imagery.

The user should transition from the computational hero into a more contemplative visual environment.

Explore:

- Large-scale sculpture imagery.
- Slow image transformations.
- Typography reveals.
- Editorial storytelling.
- Depth and layered compositions.

## Chapter 03 — Method

Introduce:

**Explore. Understand. Build.**

Instead of three static feature cards, create an interactive sequence.

Possible approach:

A pinned section where each concept transforms into the next as the user scrolls.

Explore:

- Changing typography.
- Animated grids.
- Geometric progression.
- Dynamic image composition.
- Scroll-controlled chapter transitions.

## Chapter 04 — Selected Work

Present Nummio's projects.

Initial projects:

- Nexus.
- Ion Framework.

Make this section highly interactive.

Consider:

- Large project showcases.
- Animated image transitions.
- Hover-driven previews.
- Scroll-reactive project titles.
- Full-width visual presentations.
- Smooth navigation interactions.

Do not use a conventional grid of small SaaS cards.

Use actual project assets when available.

Do not invent project screenshots or working URLs.

## Chapter 05 — Research &amp; Experiments

Create a visually expressive editorial section.

Combine Computational Forms with experimental interface elements.

Possible features:

- Dynamic visual experiments.
- Research-index-inspired layouts.
- Animated technical metadata.
- Interactive geometry.
- Grid-based editorial compositions.

Do not invent publications or research achievements.

## Chapter 06 — Philosophy / About

Introduce Nummio's identity and purpose.

Keep the copy concise.

Make the section visually memorable through typography, pacing, imagery and subtle motion.

## Chapter 07 — Closing

Create a distinctive ending.

Avoid a generic footer directly after the final content section.

Use a final visual statement:

**Ideas into existence.**

Consider a large typographic composition, subtle kinetic movement and a transition into the footer.

---

# 9. Advanced Interaction Quality

The website should feel polished at every interaction point.

Implement where appropriate:

- Custom animated navigation.
- Responsive mobile menu transitions.
- Magnetic CTAs.
- Subtle button hover effects.
- Animated link underlines.
- Responsive pointer interactions.
- Scroll progress indicators.
- Contextual section transitions.
- Refined active navigation states.

Do not implement a custom cursor unless it genuinely improves the experience.

Native usability must always take priority.

---

# 10. Performance Requirements

Premium motion must not compromise performance.

Requirements:

- Animate transform and opacity whenever possible.
- Avoid layout thrashing.
- Avoid expensive scroll listeners.
- Use ScrollTrigger efficiently.
- Limit simultaneous continuous animations.
- Lazy-load heavy WebGL components.
- Avoid unnecessary client components.
- Optimize images.
- Use appropriate image formats.
- Avoid excessive blur and backdrop-filter.
- Prevent cumulative layout shifts.
- Manage animation cleanup correctly.

Treat Lighthouse performance and Core Web Vitals as important quality metrics.

Do not sacrifice usability to achieve visual effects.

---

# 11. Accessibility and Reduced Motion

The experience must support:

- prefers-reduced-motion.
- Keyboard navigation.
- Visible focus indicators.
- Proper semantic structure.
- Adequate contrast.
- Functional mobile interactions.
- Touch-based navigation.
- Screen readers.

When reduced motion is enabled:

- Disable smooth scrolling.
- Remove unnecessary parallax.
- Disable continuous decorative animation.
- Avoid pinned scroll storytelling that obstructs navigation.
- Show content immediately or with minimal transitions.

The website must remain complete and usable without animations.

---

# 12. Responsive Creative Direction

Do not simply scale desktop layouts down to mobile.

Treat mobile as a distinct art-direction challenge.

Adapt:

- Typography scale.
- Scroll interactions.
- Pinned sequences.
- Image composition.
- Navigation.
- Interactive visualizations.
- Motion intensity.

Avoid horizontal overflow and fragile viewport-height assumptions.

Mobile should feel premium, not like a broken desktop experience.

---

# 13. Implementation Strategy

Perform the work in this sequence:

### Phase 1 — Audit

Inspect the existing implementation.

Identify:

- Visual weaknesses.
- Repetitive layout patterns.
- Motion limitations.
- Component architecture.
- Existing assets.
- Performance issues.

### Phase 2 — Creative Direction

Define the new visual architecture.

Produce a concise implementation plan covering:

- Homepage chapters.
- Motion choreography.
- Major interactions.
- Reusable motion primitives.
- Visual assets and their usage.

Do not stop at planning. Continue implementation.

### Phase 3 — Build

Refactor the website.

Prioritize:

1. Hero experience.
2. Scroll choreography.
3. Section transitions.
4. Typography.
5. Project showcases.
6. Microinteractions.
7. Responsive behavior.

Remove obsolete components and styles when safe.

### Phase 4 — Polish

Review and refine:

- Animation timing.
- Easing.
- Layout rhythm.
- Image transitions.
- Hover behavior.
- Typography.
- Mobile interactions.
- Theme behavior.
- Performance.

### Phase 5 — Verification

Run available checks:

- Lint.
- Typecheck.
- Production build.
- Browser testing where available.
- Responsive testing.
- Reduced-motion testing.

Resolve discovered problems.

Never claim tests passed unless executed.

---

# 14. Creative Quality Bar

The finished website should aspire to the quality of premium interactive digital experiences.

It should feel:

**Cinematic, intelligent, experimental, precise, alive and unmistakably Nummio.**

It must not feel:

- Generic.
- Static.
- Template-driven.
- Overcrowded.
- Like a standard SaaS homepage.
- Like an animation demo disconnected from the brand.

Every major section should contain at least one meaningful visual or interaction decision that contributes to the experience.

Avoid excessive effects that distract from content.

Build a coherent visual journey rather than a collection of unrelated animations.

---

# 15. Final Instruction

You have creative freedom to radically rethink the website.

Do not preserve mediocre design decisions simply because they already exist.

Preserve the brand, content accuracy and functional requirements — not the current visual composition.

Be ambitious.

Use advanced creative-development techniques where they materially improve the experience.

**Do not deliver another conventional landing page with basic fade-in animations.**

Implement a premium, technologically expressive and motion-driven website.

The result should feel like a digital experience created by a specialized creative development studio.

Do not stop after producing a plan.

**Execute the refactor, validate the implementation and deliver the completed website.**