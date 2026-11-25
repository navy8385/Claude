import type { Register, ThemeSetArgs, ThemeSound, ThemeStyle } from 'claude-code'

import { makeColors } from './make-colors.js'

// Red Grid: a defense-network terminal. Dark void, red phosphor, faint scanlines.
// Built from red-grid.css. It's a dark-only look, the way the original is.
const RG = {
  void: '#070000',
  surface: '#120304',
  surface2: '#1c0607',
  surface3: '#240909',
  border: '#3d0e0b',
  borderHot: '#7a1a12',
  text: '#ffd2cb',
  textDim: '#d98a7e',
  textFaint: '#c7766b',
  signal: '#ff2b1c',
  signalSoft: '#ff5a47',
  warn: '#ffb020',
  codeBg: '#0d0102',
  codeText: '#ff9c8f',
} as const

const { theme, problems } = makeColors({
  label: 'Red Grid',
  only: 'dark',
  roles: {
    accent: RG.signal,
    danger: '#e0103a', // a colder crimson, so errors still read apart from the accent
    success: '#b8c94a', // a warm phosphor green: "ok" has to stay green to mean ok
    warning: RG.warn,
    pro: '#ff6fa3',
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': RG.void,
        'surface-1': RG.surface,
        'surface-2': RG.surface2,
        'surface-3': RG.surface3,
        'text-primary': RG.text,
        'text-secondary': RG.textDim,
        'text-muted': RG.textFaint,
      },
    },
  },
})

// The backdrop: a faint targeting grid, scanlines, a red vignette and one slow
// sweep band rolling down the glass. With reduced motion the band rests off-screen.
const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<style>
  .sweep { animation: sweep 11s linear infinite; opacity: 0.0; }
  .pulse { animation: pulse 9s ease-in-out infinite; opacity: 0.5; }
  @keyframes sweep { 0% { transform: translateY(-260px); opacity: 0.9; } 100% { transform: translateY(1260px); opacity: 0.9; } }
  @keyframes pulse { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.6; } }
</style>
<defs>
  <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
    <path d="M80 0H0V80" fill="none" stroke="#3d0e0b" stroke-width="1"/>
  </pattern>
  <pattern id="lines" width="4" height="3" patternUnits="userSpaceOnUse">
    <rect y="2" width="4" height="1" fill="#000000" fill-opacity="0.35"/>
  </pattern>
  <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
    <stop offset="60%" stop-color="#3c0000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#3c0000" stop-opacity="0.55"/>
  </radialGradient>
  <radialGradient id="core" cx="50%" cy="45%" r="55%">
    <stop offset="0%" stop-color="#ff2b1c" stop-opacity="0.10"/>
    <stop offset="100%" stop-color="#ff2b1c" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="band" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#ff2b1c" stop-opacity="0"/>
    <stop offset="85%" stop-color="#ff2b1c" stop-opacity="0.05"/>
    <stop offset="100%" stop-color="#ff5a47" stop-opacity="0.12"/>
  </linearGradient>
</defs>
<rect width="1600" height="1000" fill="#070000"/>
<rect width="1600" height="1000" fill="url(#grid)" class="pulse"/>
<rect width="1600" height="1000" fill="url(#core)"/>
<g class="sweep"><rect x="0" y="0" width="1600" height="240" fill="url(#band)"/></g>
<rect width="1600" height="1000" fill="url(#lines)"/>
<rect width="1600" height="1000" fill="url(#vignette)"/>
</svg>`

// Hard 2pt corners, mono type, a hot border with a soft glow on the operator's lines.
const STYLE: ThemeStyle = {
  Text: { fontFamily: ['mono'], letterSpacing: 0.3 },
  Heading: { fontFamily: ['mono'], color: RG.signalSoft, letterSpacing: 1.6, fontWeight: 'bold' },
  UserMessage: {
    color: RG.text,
    backgroundColor: RG.surface2,
    borderColor: RG.borderHot,
    borderWidth: 1,
    radius: 2,
    paddingX: 14,
    paddingY: 10,
    shadow: { x: 0, y: 0, blur: 14, color: '#ff2b1c40' },
  },
  AssistantMessage: {
    color: RG.text,
    backgroundColor: RG.surface,
    borderColor: RG.border,
    borderWidth: 1,
    radius: 2,
    paddingX: 14,
    paddingY: 10,
  },
  ToolUse: {
    color: RG.codeText,
    fontFamily: ['code'],
    backgroundColor: RG.codeBg,
    borderColor: RG.border,
    borderWidth: 1,
    radius: 2,
    paddingX: 8,
  },
}

// A low mains hum under quiet static, and short terminal blips.
const SOUND: ThemeSound = {
  ambience: {
    layers: [
      { wave: 'sine', notes: ['B1'], drone: true, gain: 0.12, filter: { type: 'lowpass', hz: 220 } },
      { wave: 'pink', drone: true, gain: 0.04, filter: { type: 'lowpass', hz: 700, to: 1100 } },
    ],
  },
  cues: {
    send: { layers: [{ wave: 'square', notes: ['E5'], gain: 0.12, release: 0.06, filter: { type: 'lowpass', hz: 2400 } }] },
    tool: { layers: [{ wave: 'square', notes: ['B5'], gain: 0.05, release: 0.03, filter: { type: 'lowpass', hz: 2400 } }] },
    done: {
      layers: [{ wave: 'square', notes: ['A5', 'E6'], step: 0.09, gain: 0.14, release: 0.1, filter: { type: 'lowpass', hz: 3000 } }],
    },
    ask: { layers: [{ wave: 'triangle', notes: ['E5', 'E5'], step: 0.16, gain: 0.2, release: 0.12 }] },
    error: { layers: [{ wave: 'saw', notes: ['A3'], glide: -5, gain: 0.14, release: 0.5, filter: { type: 'lowpass', hz: 900 } }] },
  },
}

const BASE: ThemeSetArgs = {
  colors: theme,
  overrideColorScheme: 'dark',
  backdrop: { scene: 'red-grid', glass: { blur: 10, tint: RG.void, opacity: 0.72 } },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(`red-grid: ${unpainted}`)
    }

    let set
    try {
      set = await $.theme.set({ ...BASE, style: STYLE, sound: SOUND })
    } catch (error) {
      // An older build may not take style or sound: keep the colors and the scene.
      $.ui.log(`red-grid: ${String(error)}`)
      set = await $.theme.set(BASE)
    }

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'red-grid') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="A dark red targeting grid behind faint CRT scanlines" />
  })
}
