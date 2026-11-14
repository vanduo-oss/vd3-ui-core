/**
 * VD3 UI CORE — Tokens TypeScript Type Definitions
 * Complete strict type definitions for DTCG token structure and CSS custom properties.
 */

export type BasisClass = 'A' | 'B' | 'C';
export type ExceptionId = 'C-01' | 'C-02' | 'C-03' | 'C-04';

export interface DTCGExtensionVD3 {
  class: BasisClass;
  derivation?: string;
  reason?: string;
  exceptionId?: ExceptionId;
}

export interface DTCGToken<T = string | number | number[]> {
  $value: T;
  $type?: string;
  $description?: string;
  $extensions?: {
    vd3?: DTCGExtensionVD3;
    [key: string]: unknown;
  };
}

export interface VD3MathTokens {
  $type?: 'number';
  $description?: string;
  phi: DTCGToken<number>;
  'inv-phi': DTCGToken<number>;
  'inv-phi-sq': DTCGToken<number>;
  'sqrt-phi': DTCGToken<number>;
  'golden-angle': DTCGToken<number>;
}

export interface VD3ColorPrimitiveGray {
  '0': DTCGToken<string>;
  '1': DTCGToken<string>;
  '2': DTCGToken<string>;
  '3': DTCGToken<string>;
  '4': DTCGToken<string>;
  '5': DTCGToken<string>;
  '6': DTCGToken<string>;
  '7': DTCGToken<string>;
  '8': DTCGToken<string>;
  '9': DTCGToken<string>;
  '1000': DTCGToken<string>;
}

export interface VD3ColorPrimitiveGold {
  '4': DTCGToken<string>;
  '6': DTCGToken<string>;
  '7': DTCGToken<string>;
}

export interface VD3ColorPrimitiveRed {
  '4': DTCGToken<string>;
  '6': DTCGToken<string>;
}

export interface VD3ColorPrimitiveGoldenAngle {
  '0': DTCGToken<string>;
  '1': DTCGToken<string>;
  '2': DTCGToken<string>;
  '3': DTCGToken<string>;
  '4': DTCGToken<string>;
  '5': DTCGToken<string>;
  '6': DTCGToken<string>;
  '7': DTCGToken<string>;
}

export interface VD3ColorRoleTokens {
  $type?: 'color';
  $description?: string;
  canvas: DTCGToken<string>;
  layer: DTCGToken<string>;
  'layer-hover': DTCGToken<string>;
  'text-primary': DTCGToken<string>;
  'text-secondary': DTCGToken<string>;
  border: DTCGToken<string>;
  focus: DTCGToken<string>;
  interactive: DTCGToken<string>;
  critical: DTCGToken<string>;
  shadow: DTCGToken<string>;
}

export interface VD3ColorTokens {
  primitive: {
    $type?: 'color';
    $description?: string;
    gray: VD3ColorPrimitiveGray;
    gold: VD3ColorPrimitiveGold;
    red: VD3ColorPrimitiveRed;
    'golden-angle': VD3ColorPrimitiveGoldenAngle;
  };
  role: VD3ColorRoleTokens;
}

export interface VD3ThemeTokens {
  dark: {
    color: {
      role: VD3ColorRoleTokens;
    };
  };
}

export interface VD3SpaceTokens {
  $type?: 'dimension';
  $description?: string;
  'fib-1': DTCGToken<string>;
  'fib-2': DTCGToken<string>;
  'fib-3': DTCGToken<string>;
  'fib-5': DTCGToken<string>;
  'fib-8': DTCGToken<string>;
  'fib-13': DTCGToken<string>;
  'fib-21': DTCGToken<string>;
  'fib-34': DTCGToken<string>;
  'fib-55': DTCGToken<string>;
  'fib-89': DTCGToken<string>;
  'fib-144': DTCGToken<string>;
}

export interface VD3LineTokens {
  $type?: 'dimension';
  $description?: string;
  hair: DTCGToken<string>;
  thin: DTCGToken<string>;
  regular: DTCGToken<string>;
  thick: DTCGToken<string>;
}

export interface VD3RadiusTokens {
  $type?: 'dimension';
  $description?: string;
  'fib-2': DTCGToken<string>;
  'fib-3': DTCGToken<string>;
  'fib-5': DTCGToken<string>;
  'fib-8': DTCGToken<string>;
  'fib-13': DTCGToken<string>;
  'fib-21': DTCGToken<string>;
  full: DTCGToken<string>;
}

export interface VD3ShadowTokens {
  $type?: 'shadow';
  $description?: string;
  '1': DTCGToken<string>;
  '2': DTCGToken<string>;
  '3': DTCGToken<string>;
  '4': DTCGToken<string>;
  '5': DTCGToken<string>;
  '6': DTCGToken<string>;
}

export interface VD3GlowTokens {
  $type?: 'dimension';
  $description?: string;
  'fib-8': DTCGToken<string>;
  'fib-13': DTCGToken<string>;
  'fib-21': DTCGToken<string>;
}

export interface VD3ZTokens {
  $type?: 'number';
  $description?: string;
  base: DTCGToken<number>;
  dropdown: DTCGToken<number>;
  sticky: DTCGToken<number>;
  fixed: DTCGToken<number>;
  'modal-backdrop': DTCGToken<number>;
  modal: DTCGToken<number>;
  popover: DTCGToken<number>;
  tooltip: DTCGToken<number>;
  toast: DTCGToken<number>;
}

export interface VD3ContainerTokens {
  $type?: 'dimension';
  $description?: string;
  sm: DTCGToken<string>;
  md: DTCGToken<string>;
  lg: DTCGToken<string>;
  xl: DTCGToken<string>;
  '2xl': DTCGToken<string>;
}

export interface VD3BreakpointTokens {
  $type?: 'dimension';
  $description?: string;
  sm: DTCGToken<string>;
  md: DTCGToken<string>;
  lg: DTCGToken<string>;
  xl: DTCGToken<string>;
  '2xl': DTCGToken<string>;
}

export interface VD3TypeTokens {
  $description?: string;
  size: {
    $type?: 'dimension';
    xs: DTCGToken<string>;
    sm: DTCGToken<string>;
    base: DTCGToken<string>;
    lg: DTCGToken<string>;
    xl: DTCGToken<string>;
    '2xl': DTCGToken<string>;
    '3xl': DTCGToken<string>;
    '4xl': DTCGToken<string>;
    '5xl': DTCGToken<string>;
    '6xl': DTCGToken<string>;
  };
  leading: {
    $type?: 'number';
    $description?: string;
    tight: DTCGToken<number>;
    snug: DTCGToken<number>;
    normal: DTCGToken<number>;
    relaxed: DTCGToken<number>;
    loose: DTCGToken<number>;
  };
  tracking: {
    $type?: 'dimension';
    $description?: string;
    tighter: DTCGToken<string>;
    tight: DTCGToken<string>;
    normal: DTCGToken<string>;
    wide: DTCGToken<string>;
    wider: DTCGToken<string>;
    widest: DTCGToken<string>;
  };
}

export interface VD3MotionTokens {
  $type?: 'duration';
  $description?: string;
  '0': DTCGToken<string>;
  '55': DTCGToken<string>;
  '89': DTCGToken<string>;
  '144': DTCGToken<string>;
  '233': DTCGToken<string>;
  '377': DTCGToken<string>;
  '610': DTCGToken<string>;
  '987': DTCGToken<string>;
  instant: DTCGToken<string>;
  fast: DTCGToken<string>;
  base: DTCGToken<string>;
  slow: DTCGToken<string>;
  slower: DTCGToken<string>;
  slowest: DTCGToken<string>;
}

export interface VD3EasingTokens {
  $type?: 'cubicBezier';
  $description?: string;
  out: DTCGToken<[number, number, number, number]>;
  in: DTCGToken<[number, number, number, number]>;
  'in-out': DTCGToken<[number, number, number, number]>;
  linear: DTCGToken<[number, number, number, number]>;
}

export interface VD3AspectTokens {
  $type?: 'aspectRatio';
  $description?: string;
  golden: DTCGToken<string>;
  'golden-portrait': DTCGToken<string>;
}

export interface VD3GlassTokens {
  $description?: string;
  'blur-sm': DTCGToken<string>;
  'blur-md': DTCGToken<string>;
  'blur-lg': DTCGToken<string>;
  'blur-xl': DTCGToken<string>;
  'saturate-md': DTCGToken<string>;
  'saturate-lg': DTCGToken<string>;
  'tint-sm': DTCGToken<number>;
  'tint-md': DTCGToken<number>;
  'tint-lg': DTCGToken<number>;
  'tint-xl': DTCGToken<number>;
}

export interface VD3Tokens {
  $description: string;
  $vd3: {
    spec: string;
    auditedAgainst: string;
  };
  math: VD3MathTokens;
  color: VD3ColorTokens;
  theme: VD3ThemeTokens;
  space: VD3SpaceTokens;
  line: VD3LineTokens;
  radius: VD3RadiusTokens;
  shadow: VD3ShadowTokens;
  glow: VD3GlowTokens;
  z: VD3ZTokens;
  container: VD3ContainerTokens;
  breakpoint: VD3BreakpointTokens;
  type: VD3TypeTokens;
  motion: VD3MotionTokens;
  easing: VD3EasingTokens;
  aspect: VD3AspectTokens;
  glass: VD3GlassTokens;
}

export type VD3ThemeMode = 'light' | 'dark' | 'system';

export type VD3CSSPropertyName =
  | '--vd3-phi'
  | '--vd3-inv-phi'
  | '--vd3-inv-phi-sq'
  | '--vd3-sqrt-phi'
  | '--vd3-golden-angle'
  | `--vd3-space-fib-${1 | 2 | 3 | 5 | 8 | 13 | 21 | 34 | 55 | 89 | 144}`
  | `--vd3-spacing-${1 | 2 | 3 | 5 | 8 | 13 | 21 | 34 | 55 | 89 | 144}`
  | '--vd3-border-width-hair'
  | '--vd3-border-width-thin'
  | '--vd3-border-width-regular'
  | '--vd3-border-width-thick'
  | '--vd3-line-hair'
  | '--vd3-line-thin'
  | '--vd3-line-regular'
  | '--vd3-line-thick'
  | `--vd3-radius-fib-${2 | 3 | 5 | 8 | 13 | 21}`
  | '--vd3-radius-full'
  | `--vd3-container-${'sm' | 'md' | 'lg' | 'xl' | '2xl'}`
  | `--vd3-breakpoint-${'sm' | 'md' | 'lg' | 'xl' | '2xl'}`
  | '--vd3-aspect-golden'
  | '--vd3-aspect-golden-portrait'
  | `--vd3-glass-blur-${'sm' | 'md' | 'lg' | 'xl'}`
  | `--vd3-glass-saturate-${'md' | 'lg'}`
  | `--vd3-glass-tint-${'sm' | 'md' | 'lg' | 'xl'}`
  | `--vd3-font-size-${'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'}`
  | `--vd3-line-height-${'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'}`
  | `--vd3-leading-${'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'}`
  | `--vd3-letter-spacing-${'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest'}`
  | `--vd3-tracking-${'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest'}`
  | `--vd3-shadow-${1 | 2 | 3 | 4 | 5 | 6 | 'sm' | 'md' | 'lg' | 'xl' | '2xl'}`
  | '--vd3-shadow'
  | `--vd3-glow-fib-${8 | 13 | 21}`
  | `--vd3-z-${'base' | 'dropdown' | 'sticky' | 'fixed' | 'modal-backdrop' | 'modal' | 'popover' | 'tooltip' | 'toast'}`
  | `--vd3-duration-${0 | 55 | 89 | 144 | 233 | 377 | 610 | 987 | 'instant' | 'fast' | 'base' | 'slow' | 'slower' | 'slowest'}`
  | `--vd3-ease-${'out' | 'in' | 'in-out' | 'linear'}`
  | `--vd3-color-gray-${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 1000}`
  | `--vd3-color-gold-${4 | 6 | 7}`
  | `--vd3-color-red-${4 | 6}`
  | `--vd3-color-golden-${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7}`
  | `--vd3-color-${'canvas' | 'layer' | 'layer-hover' | 'text-primary' | 'text-secondary' | 'border' | 'border-subtle' | 'focus' | 'focus-glow' | 'interactive' | 'critical' | 'shadow'}`
  | `--vd3-focus-ring-${'width' | 'offset' | 'color' | 'offset-color' | 'glow'}`;

export type VDCSSPropertyName =
  | '--vd-phi'
  | '--vd-golden-angle'
  | `--vd-space-fib-${1 | 2 | 3 | 5 | 8 | 13 | 21 | 34 | 55 | 89 | 144}`
  | `--vd-spacing-${1 | 2 | 3 | 5 | 8 | 13 | 21 | 34 | 55 | 89 | 144}`
  | '--vd-border-width'
  | `--vd-line-${'hair' | 'thin' | 'regular' | 'thick'}`
  | `--vd-radius-fib-${2 | 3 | 5 | 8 | 13 | 21}`
  | '--vd-radius-full'
  | `--vd-container-${'sm' | 'md' | 'lg' | 'xl' | '2xl'}`
  | `--vd-breakpoint-${'sm' | 'md' | 'lg' | 'xl' | '2xl'}`
  | `--vd-font-size-${'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'}`
  | `--vd-line-height-${'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'}`
  | `--vd-leading-${'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'}`
  | `--vd-letter-spacing-${'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest'}`
  | `--vd-shadow-${1 | 2 | 3 | 4 | 5 | 6 | 'sm' | 'md' | 'lg' | 'xl' | '2xl'}`
  | '--vd-shadow'
  | `--vd-glow-fib-${8 | 13 | 21}`
  | `--vd-z-${'base' | 'dropdown' | 'sticky' | 'fixed' | 'modal-backdrop' | 'modal' | 'popover' | 'tooltip' | 'toast'}`
  | `--vd-duration-${0 | 55 | 89 | 144 | 233 | 377 | 610 | 987 | 'instant' | 'fast' | 'base' | 'slow' | 'slower' | 'slowest'}`
  | `--vd-ease-${'out' | 'in' | 'in-out' | 'linear'}`
  | `--vd-gray-${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
  | '--vd-bg-darker'
  | `--vd-yellow-${4 | 6 | 7}`
  | `--vd-red-${4 | 6}`
  | '--vd-bg-primary'
  | '--vd-bg-secondary'
  | '--vd-bg-tertiary'
  | '--vd-text-primary'
  | '--vd-text-secondary'
  | '--vd-text-muted'
  | '--vd-border-color'
  | '--vd-color-primary'
  | '--vd-color-primary-hover'
  | '--vd-color-error'
  | '--vd-color-danger';
