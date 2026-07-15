# New Version — design source of truth

## Scope

- Change only the `/v2` route. The current site remains intact.
- Preserve the useful information from New Version, but do not reuse its previous style or composition.
- Keep five clear zones: hero, services, approach, business result, contacts.

## Canvas

- Treat the whole page as one continuous, near-black quantum space. Section backgrounds do not change color.
- Use large intervals and a small number of deliberate objects so the empty space remains visible.
- Add restrained green–blue and white blurred forms: circles and irregular polygons made only from straight edges.
- Forms carry a fine grain and sit behind translucent glass surfaces so their blur is visible through a panel.
- Separate zones with thin lines that stop before the viewport edges.

## Motion

- A fixed canvas draws rare, crisp white or silver streaks. They appear quickly, accelerate and become longer as they travel.
- Native page scrolling remains in control. Scroll-linked scenes follow real scroll progress and reverse naturally when scrolling upward.
- Respect `prefers-reduced-motion` with static background details and a non-animated cube state.

## Hero cube

- Draw a transparent wireframe cube with visible rear edges.
- Front edges are strongest, connecting edges are medium, rear edges are thinnest.
- The cube does not translate through space. Its depth axis slowly traces a small clockwise circle by changing the direction of its gaze.
- Fix the letters `К У Б И Т X` to six individual faces. Use a square, heavy typeface and face-specific perspective transforms.
- Reveal the letters in place at two-second intervals; they never swap faces.
- Set the main `КУБИТЭКС` wordmark in a bold green–blue gradient.
- Keep the large wordmark at its original hero size and horizontal position. It travels upward with page scroll, then stops with a responsive inset that centers it in the empty upper space instead of touching the viewport edge.
- Hold the cube at its hero position until the viewport top has crossed the exact centre of the original cube and the wordmark has already reached its sticky top position. Only after both conditions are true, fade the cube out, switch instantly to a smaller position to the left of the sticky wordmark while fully transparent, and fade it straight back in without a pause. In the compact state, multiply every cube-edge width by four and the face-letter size by 1.5. Reverse all state changes only at zero opacity when scrolling upward.
- Keep the compact relocation implementation behind `enableCompactCubeRelocation`. It is currently disabled: the large cube remains anchored to its hero position and leaves the viewport naturally with the section.
- Anchor the floating wordmark to the live left edge of the shared content shell with a fixed 5 px correction for the first glyph's internal side bearing. Place the compact cube from the wordmark geometry itself: scale it to 1.4 times the original compact size, increase the horizontal clearance proportionally, and retain the established vertical centre against the word so browser zoom and responsive layout cannot separate the two parts of the lockup.
- Keep all accent-driven surfaces on one selectable palette system. The header swatches change the wordmark, cube, atmosphere, canvas tint and interface highlights together, and preserve the selected mood locally.

## Services

- Put the eight service cards into one vertical scroll-driven deck.
- The incoming card rises from below and covers the previous card. The previous card moves upward, scales down and remains partly visible before disappearing behind the next one.
- Keep the selected service information fixed on the open canvas to the right, without an outer panel.
- Crossfade the title, description, outcomes, formats and technology environment as the active card changes.
- Clicking a visible card scrolls smoothly to its exact position in the sequence.

## Zone navigation

- Keep a vertical rail of short lines to the left of the content on desktop.
- Lines extend to the right according to cursor proximity within a 112 px radius.
- Show the zone label after 100 ms of intentional hover. Clicking moves smoothly to that zone.
- On touch layouts, convert the rail into a compact horizontal progress control near the bottom edge.

## Header

- Do not duplicate the identity with a separate header mark. The sticky hero wordmark remains the dominant identity, and the cube joins it only after the fade-and-relocate sequence.
- Keep `Наши проекты` connected to `VITE_PROJECTS_URL`, matching the V1 project destination, with the contact action beside it where width allows.

## Information hierarchy

- Use only two information states: content directly on the canvas and content inside a purposeful glass panel.
- Hero, service details and process steps stay open on the canvas.
- Service cards, business-result cards and the final contact surface use glass.
- Keep typography large, copy concise and controls understandable to a non-technical visitor.

## Removed from the previous visual system

- Light hero and light results backgrounds.
- Theme presets and the theme switcher.
- The old quantum spin-pair illustration.
- Dense card grids, decorative labels and any copy that does not help the visitor make a decision.
