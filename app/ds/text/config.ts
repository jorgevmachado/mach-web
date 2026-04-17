
import {
  type TextAlign,
  type TextBreak,
  type TextDecoration,
  type TextDisplay,
  type TextFontFamily,
  type TextLeading,
  type TextLineClamp,
  type TextSize,
  type TextTag,
  type TextTone,
  type TextTracking,
  type TextTransform,
  type TextWhitespace,
  type TextWrap,
  type TextTagProps,
} from './types';


export const TAG_CLASS_MAP_PROPS: Record<TextTag, TextTagProps> = {
  blockquote: {
    tone: 'neutral',
    className: 'border-l-4 border-slate-200 pl-4 italic',
  },
  code: {
    size: 'sm',
    color: 'text-slate-800',
    fontFamily: 'mono',
    className: 'rounded-md bg-slate-100 px-1.5 py-0.5',
  },
  div: {
    size: 'base',
    tone:'neutral',
  },
  em: {
    tone:'neutral',
    className:'italic'
  },
  figcaption: {
    size: 'sm',
    tone: 'subtle',
  },
  h1: {
    size: '4xl',
    weight: 'bold',
    tracking: 'tight',
    color: 'text-slate-950',
    className:'md:text-5xl'
  },
  h2: {
    size: '3xl',
    weight: 'bold',
    tracking: 'tight',
    color: 'text-slate-950',
    className:'md:text-4xl'
  },
  h3: {
    size: '2xl',
    tone: 'default',
    weight: 'semibold',
    tracking: 'tight',
  },
  h4: {
    size: 'xl',
    weight: 'semibold',
    tone: 'default',
  },
  h5: {
    tone: 'default' ,
    size: 'lg' ,
    weight: 'semibold' ,
  },
  h6: {
    tone: 'default' ,
    size: 'base' ,
    weight: 'semibold' ,
  },
  label: {
    tone:'neutral',
    size: 'sm',
    weight: 'medium',
  },
  legend: {
    size: 'sm',
    weight: 'semibold',
    color: 'text-slate-800',
  },
  mark: {
    color: 'text-amber-950',
    className: 'bg-amber-100 px-1'
  },
  p: {
    tone:'neutral',
    size: 'base',
    leading: '7',
  },
  small: {
    size: 'sm',
    tone: 'subtle',
  },
  span: { tone:'inherit' },
  strong:{
    tone: 'default',
    weight: 'semibold',
  },
};

export const SIZE_CLASS_MAP: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
  '7xl': 'text-7xl',
  '8xl': 'text-8xl',
  '9xl': 'text-9xl',
};

export const TONE_CLASS_MAP: Record<TextTone, string> = {
  default: 'text-slate-900',
  muted: 'text-slate-600',
  subtle: 'text-slate-500',
  primary: 'text-blue-600',
  secondary: 'text-violet-600',
  success: 'text-emerald-600',
  warning: 'text-amber-600',
  danger: 'text-rose-600',
  info: 'text-sky-600',
  neutral: 'text-slate-700',
  inherit: 'text-inherit',
};

export const ALIGN_CLASS_MAP: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
  start: 'text-start',
  end: 'text-end',
};

export const TRANSFORM_CLASS_MAP: Record<TextTransform, string> = {
  none: 'normal-case',
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize',
};

export const TRACKING_CLASS_MAP: Record<TextTracking, string> = {
  tighter: 'tracking-tighter',
  tight: 'tracking-tight',
  normal: 'tracking-normal',
  wide: 'tracking-wide',
  wider: 'tracking-wider',
  widest: 'tracking-widest',
};

export const LEADING_CLASS_MAP: Record<TextLeading, string> = {
  none: 'leading-none',
  tight: 'leading-tight',
  snug: 'leading-snug',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
  loose: 'leading-loose',
  '3': 'leading-3',
  '4': 'leading-4',
  '5': 'leading-5',
  '6': 'leading-6',
  '7': 'leading-7',
  '8': 'leading-8',
  '9': 'leading-9',
  '10': 'leading-10',
};

export const DECORATION_CLASS_MAP: Record<TextDecoration, string> = {
  none: 'no-underline',
  underline: 'underline',
  lineThrough: 'line-through',
  overline: 'overline',
};

export const FONT_FAMILY_CLASS_MAP: Record<TextFontFamily, string> = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
};

export const DISPLAY_CLASS_MAP: Record<TextDisplay, string> = {
  block: 'block',
  inline: 'inline',
  inlineBlock: 'inline-block',
};

export const WRAP_CLASS_MAP: Record<TextWrap, string> = {
  wrap: 'text-wrap',
  nowrap: 'text-nowrap',
  balance: 'text-balance',
  pretty: 'text-pretty',
};

export const WHITESPACE_CLASS_MAP: Record<TextWhitespace, string> = {
  normal: 'whitespace-normal',
  nowrap: 'whitespace-nowrap',
  pre: 'whitespace-pre',
  preLine: 'whitespace-pre-line',
  preWrap: 'whitespace-pre-wrap',
  breakSpaces: 'whitespace-break-spaces',
};

export const BREAK_CLASS_MAP: Record<TextBreak, string> = {
  normal: 'break-normal',
  words: 'break-words',
  all: 'break-all',
  keep: 'break-keep',
};

export const LINE_CLAMP_CLASS_MAP: Record<TextLineClamp, string> = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
  none: 'line-clamp-none',
};