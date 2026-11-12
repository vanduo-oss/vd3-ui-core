/**
 * The spec repo is the source of truth for the site: this module reads the
 * normative DTCG token file and derives demo data from it. Change a token in
 * tokens/vd3.tokens.json and the site re-proves itself on next build.
 */
// @ts-expect-error JSON import from outside the app root via the @spec alias
import specTokens from '@spec/tokens/vd3.tokens.json'

const t = specTokens as any

const remToPx = (v: string) => Math.round(parseFloat(v) * 16)

// token entries only — skip group-level $type / $description keys
const entries = (group: any): [string, any][] =>
  Object.entries(group).filter(([k, v]: [string, any]) => !k.startsWith('$') && v && '$value' in v)

export const spaceSteps = entries(t.space)
  .filter(([k]) => k.startsWith('fib'))
  .map(([k, v]: [string, any]) => ({
    name: k,
    token: `--vd-space-${k}`,
    rem: v.$value as string,
    px: remToPx(v.$value),
    c01: /C-01/.test(v.$description ?? ''),
    desc: v.$description ?? '',
  }))

export const lineWeights = entries(t.line).map(([k, v]: [string, any]) => ({
  name: k,
  token: `--vd-line-${k}`,
  px: remToPx(v.$value) || parseInt(v.$value, 10),
  css: v.$value as string,
}))

export const shadowLevels = entries(t.shadow).map(([k, v]: [string, any]) => ({
  level: k,
  token: `--vd-shadow-${k}`,
  css: (v.$value as string).replace('{color.role.shadow}', t.color.role.shadow.$value),
  pair: v.$description ?? '',
}))

export const containers = entries(t.container).map(([k, v]: [string, any]) => ({
  name: k,
  px: parseInt(v.$value as string, 10),
  note: v.$description ?? '',
}))

export const typeSizes = entries(t.type.size).map(([k, v]: [string, any]) => ({
  name: k,
  css: v.$value as string,
  px: remToPx(v.$value),
  desc: v.$description ?? '',
}))

export const leadings = entries(t.type.leading).map(([k, v]: [string, any]) => ({
  name: k,
  value: v.$value,
  desc: v.$description ?? '',
}))

export const motionDurations = entries(t.motion).map(([k, v]: [string, any]) => ({
  name: k,
  token: `--vd-motion-${k}`,
  ms: parseInt(v.$value as string, 10),
  use: v.$description ?? '',
}))

export const zLadder = entries(t.z).map(([k, v]: [string, any]) => ({
  name: k,
  value: v.$value,
}))

export const glowSteps = entries(t.glow).map(([k, v]: [string, any]) => ({
  name: k,
  px: remToPx(v.$value),
}))

export const roleColors = entries(t.color.role).map(([k, v]: [string, any]) => ({
  name: k,
  token: `--vd-${k}`,
  ref: v.$value as string,
}))
