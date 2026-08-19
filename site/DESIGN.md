---
name: Core Service Logic
colors:
  surface: '#faf9fb'
  surface-dim: '#dbd9dc'
  surface-bright: '#faf9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f6'
  surface-container: '#efedf0'
  surface-container-high: '#e9e8ea'
  surface-container-highest: '#e3e2e5'
  on-surface: '#1b1c1e'
  on-surface-variant: '#43474d'
  inverse-surface: '#2f3033'
  inverse-on-surface: '#f2f0f3'
  outline: '#74777e'
  outline-variant: '#c4c6ce'
  surface-tint: '#49607e'
  primary: '#000f22'
  on-primary: '#ffffff'
  primary-container: '#0a2540'
  on-primary-container: '#768dad'
  inverse-primary: '#b0c8eb'
  secondary: '#004ccc'
  on-secondary: '#ffffff'
  secondary-container: '#0762ff'
  on-secondary-container: '#f3f3ff'
  tertiary: '#000f22'
  on-tertiary: '#ffffff'
  tertiary-container: '#142538'
  on-tertiary-container: '#7c8ca4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#b0c8eb'
  on-primary-fixed: '#001c37'
  on-primary-fixed-variant: '#314865'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#faf9fb'
  on-background: '#1b1c1e'
  surface-variant: '#e3e2e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
This design system is engineered for mission-critical service order management. The visual narrative centers on **Corporate Modernism** with a high-tech edge, prioritizing clarity, speed of cognition, and institutional reliability. 

The aesthetic is characterized by a "density-optimized" interface—balancing high information throughput with enough whitespace to prevent cognitive fatigue. It utilizes a structured layering system to separate navigation, orchestration, and action, ensuring users feel in complete control of complex logistical workflows.

## Colors
The palette is anchored by **Deep Tech Blue**, providing a sophisticated and authoritative foundation for headers and primary navigation. **Action Blue** is reserved exclusively for interactive elements and primary call-to-actions to create a clear "path to completion."

Status indicators use a high-chroma semantic set to ensure immediate recognition of order states (Completed, Pending, Overdue). Neutral tones utilize a Slate Gray scale to maintain high contrast for data legibility while avoiding the harshness of pure black.

## Typography
Inter is used across all levels to provide a systematic, neutral, and highly legible experience. For service order IDs and technical data strings, a secondary monospaced font (JetBrains Mono) is introduced to prevent character confusion.

- **Headlines:** Use tight tracking and semi-bold weights to establish clear hierarchy.
- **Data Grids:** Use `body-md` for standard cell content to maximize information density.
- **Labels:** Use uppercase `label-md` for table headers and section overviews to differentiate from editable content.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. Navigation sidebars are fixed-width (280px) to provide a stable anchor, while the main content area utilizes a 12-column fluid grid.

- **Rhythm:** All spacing is derived from a 4px baseline grid.
- **Density:** Use "Compact" spacing (8px gutters) for data-heavy dashboard widgets and "Default" spacing (16px gutters) for standard forms and profiles.
- **Adaptation:** On mobile, the 12-column grid collapses to a single column with 16px horizontal margins.

## Elevation & Depth
Depth is signaled through **Tonal Layering** supplemented by subtle ambient shadows. Surfaces do not "float" high; instead, they appear as distinct sheets organized logically.

- **Level 0 (Background):** `background_subtle` (#F8FAFC).
- **Level 1 (Cards/Surface):** Pure white with a 1px border (#E2E8F0) and a very soft 4px blur shadow (5% opacity).
- **Level 2 (Modals/Popovers):** Pure white with a 12px blur shadow (10% opacity) and a 1px border.

Shadows should use the `primary_color_hex` as a tint base rather than pure black to maintain the "Deep Tech" feel.

## Shapes
The system utilizes a **Rounded** (8px base) corner radius strategy. This strikes a balance between the precision of professional software and the approachability of modern web tools. 

- **Standard Elements:** 8px (Buttons, Input Fields, Small Cards).
- **Large Containers:** 16px (Main dashboard panels, Modals).
- **Status Pills:** Fully rounded (500px) to distinguish them from interactive buttons.

## Components
- **Buttons:** Primary buttons use `secondary_color_hex` (Action Blue) with white text. Secondary buttons use a transparent background with a 1px slate border.
- **Status Chips:** Small, high-contrast badges using semantic colors. Success uses a light green background (10% opacity) with a dark green stroke and text.
- **Inputs:** Focused states must use a 2px "Action Blue" ring with a 2px offset. Include clear validation states (Red/Green) below the field.
- **Data Tables:** Row hovering should use a subtle gray highlight (#F1F5F9). Columns containing IDs or currency should be right-aligned for easier scanning.
- **Service Cards:** Use a left-border "accent strip" (4px wide) that matches the order status color to provide instant visual categorization without overwhelming the card content.