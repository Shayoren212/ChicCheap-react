---
name: ChicCheap
colors:
  surface: '#fbf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#fbf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ee'
  surface-container: '#f0eee9'
  surface-container-high: '#eae8e3'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#43474c'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#74777d'
  outline-variant: '#c4c6cd'
  surface-tint: '#4e6073'
  primary: '#162839'
  on-primary: '#ffffff'
  primary-container: '#2c3e50'
  on-primary-container: '#96a9be'
  inverse-primary: '#b5c8df'
  secondary: '#7b5455'
  on-secondary: '#ffffff'
  secondary-container: '#fdcbcb'
  on-secondary-container: '#795354'
  tertiary: '#132c11'
  on-tertiary: '#ffffff'
  tertiary-container: '#294225'
  on-tertiary-container: '#91ae89'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d1e4fb'
  primary-fixed-dim: '#b5c8df'
  on-primary-fixed: '#091d2e'
  on-primary-fixed-variant: '#36485b'
  secondary-fixed: '#ffdad9'
  secondary-fixed-dim: '#ecbbba'
  on-secondary-fixed: '#2f1314'
  on-secondary-fixed-variant: '#603d3e'
  tertiary-fixed: '#ccebc2'
  tertiary-fixed-dim: '#b1cfa7'
  on-tertiary-fixed: '#082007'
  on-tertiary-fixed-variant: '#334d2f'
  background: '#fbf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e4e2dd'
typography:
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 28px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Manrope
    fontSize: 10px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-margin: 20px
  gutter-grid: 12px
  stack-sm: 4px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is defined by a "Curated Editorial" aesthetic—merging the high-touch feel of a luxury fashion magazine with the effortless discovery of a digital mood board. It targets discerning shoppers who value sustainability without sacrificing the prestige of high-end fashion.

The style is a blend of **Minimalism** and **Tactile Modernism**. It prioritizes heavy whitespace and a refined color palette to allow product photography to serve as the primary visual driver. By utilizing an organic masonry grid, the system avoids the rigid feel of traditional e-commerce, instead fostering a sense of "the find"—an accidental discovery of something beautiful. The interface should feel calm, expensive, and intentional.

## Colors

This design system utilizes a sophisticated, low-contrast foundation to evoke comfort and exclusivity. 

- **Primary (Navy Blue):** Used for structural elements, navigation, and primary headings to establish authority and trust.
- **Secondary (Soft Pink):** Reserved for high-intent actions (Purchase, Add to Bag) and emotional triggers (Favorites/Likes).
- **Tertiary (Soft Green):** Employed for non-interactive status indicators and decorative iconography, providing a sense of renewal and tranquility.
- **Background (Cream):** Replaces pure white to reduce eye strain and provide a "gallery" backdrop that feels warmer and more premium.
- **Functional Colors:** Deep Wine Red and Sage Green are used sparingly for system feedback, ensuring they do not compete with the fashion photography.

## Typography

The typography strategy relies on a classic serif-and-sans-serif pairing. 

**EB Garamond** is used for all headings. Its graceful, high-contrast strokes communicate a literary and luxury heritage. For smaller headings, the weight is slightly increased to maintain legibility against the cream background.

**Manrope** serves as the functional workhorse for body text and labels. Its modern, geometric construction provides a clean counterpoint to the serif headings. Labels and secondary metadata utilize increased letter spacing and uppercase styling to create a distinct visual hierarchy without increasing font size.

## Layout & Spacing

The design system employs a **Fluid Masonry Grid** to mirror the organic nature of fashion discovery. 

- **Mobile:** A 2-column staggered grid with 20px outer margins. Card heights vary based on image aspect ratios (e.g., 4:5, 2:3, 1:1), creating a dynamic vertical rhythm.
- **Desktop:** A 4-to-6 column fluid grid. Gutters remain tight (12px) to keep the focus on the imagery rather than the negative space between them.

Spacing follows an 8px base scale. Horizontal padding within components is intentionally generous to maintain an "airy" editorial feel. Content blocks should be separated by larger vertical stacks (32px+) to prevent the interface from feeling cluttered.

## Elevation & Depth

This design system avoids heavy shadows in favor of **Tonal Layers** and **Soft Ambient Occlusion**.

- **Surface Levels:** The Cream background (#F9F7F2) is the base. Elevated components (like cards or floating navigation) use a pure white background or a very subtle 2% opacity tint of Navy Blue.
- **Shadows:** Only used for interactive elements in an "active" or "hover" state. Shadows must be highly diffused (20px-30px blur), low-opacity (8-10%), and tinted with the Navy Blue (#2C3E50) to keep the depth feeling natural rather than synthetic.
- **Dividers:** Use 1px solid lines in a very pale version of Warm Gray. Avoid dividers where whitespace can suffice to define boundaries.

## Shapes

The shape language is **Soft and Architectural**. 

A consistent 4px (0.25rem) corner radius is applied to most UI elements, including primary buttons and input fields. This subtle rounding softens the interface while maintaining the structured, sophisticated feel of a high-end brand. 

Product images in the masonry grid should utilize a slightly larger radius (8px) to feel more like physical "cards" or "photographs." Circular shapes are reserved exclusively for avatars and the "Favorite" (Heart) floating action buttons to create a clear distinction between content and interaction.

## Components

### Buttons & Interaction
- **Primary Action:** Solid Soft Pink (#D4A5A5) with white text. High-contrast and rounded (4px).
- **Secondary Action:** Ghost style with Navy Blue borders and text. 
- **Favorites:** A floating circular button with a Soft Pink heart icon, appearing in the bottom right of product cards.

### Discovery Cards
- **Product Cards:** No visible borders. Imagery is the hero. Information (Brand, Size, Price) is bottom-aligned using Manrope (Body-sm). Price is emphasized in Navy Blue.
- **Tags/Chips:** Small, Soft Green backgrounds with 50% opacity and dark green text, used for "New Arrival" or "Rare Find" status.

### Inputs & Navigation
- **Search Bar:** A minimalist, underline-only or very light-bordered field to minimize visual noise.
- **Navigation:** A fixed bottom bar on mobile using Navy Blue icons and labels, ensuring the thumb-zone is always accessible for quick filtering.
- **Success/Error States:** Use Sage Green and Deep Wine Red respectively, but apply them only to text or small icons to avoid breaking the "Cream" aesthetic of the page.