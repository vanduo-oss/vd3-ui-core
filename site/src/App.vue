<script setup lang="ts">
import { VdBadge, VdCard, VdChip } from '@vanduo-oss/vd3'
import SiteNavbar from './components/SiteNavbar.vue'
import MdDoc from './components/MdDoc.vue'
import FoundationTable from './components/FoundationTable.vue'
import ProportionDemos from './components/demos/ProportionDemos.vue'
import SpacingDemo from './components/demos/SpacingDemo.vue'
import LineDemo from './components/demos/LineDemo.vue'
import TypeDemo from './components/demos/TypeDemo.vue'
import MotionDemo from './components/demos/MotionDemo.vue'
import ElevationDemo from './components/demos/ElevationDemo.vue'
import GlassDemo from './components/demos/GlassDemo.vue'
import ColorDemo from './components/demos/ColorDemo.vue'
import GridDemo from './components/demos/GridDemo.vue'

// The markdown spec is the source of truth — sections render it verbatim.
import principlesMd from '@spec/foundations/principles.md?raw'
import proportionMd from '@spec/foundations/proportion.md?raw'
import typographyMd from '@spec/foundations/typography.md?raw'
import motionMd from '@spec/foundations/motion.md?raw'
import elevationMd from '@spec/foundations/elevation.md?raw'
import colorMd from '@spec/foundations/color.md?raw'
import dialogMd from '@spec/components/dialog/spec.md?raw'

const links = [
  { id: 'contract', label: 'Contract' },
  { id: 'proportion', label: 'Proportion' },
  { id: 'space', label: 'Space' },
  { id: 'line', label: 'Line' },
  { id: 'type', label: 'Type' },
  { id: 'motion', label: 'Motion' },
  { id: 'elevation', label: 'Elevation' },
  { id: 'glass', label: 'Glass' },
  { id: 'color', label: 'Color' },
  { id: 'grid', label: 'Grid' },
  { id: 'foundations', label: 'Foundations' },
  { id: 'components', label: 'Components' },
]
</script>

<template>
  <SiteNavbar :links="links" />

  <main id="top">
    <!-- HERO -->
    <section class="hero">
      <h1>The design bible of <em>vd3</em>.</h1>
      <p class="lead">First principles, proportions, foundations, and normative tokens for the vd3
      design system. Fibonacci-first — pragmatic where familiarity beats math. No component code in
      the spec: this is what the code implements. This very page is built with
      <code>@vanduo-oss/vd3</code> itself.</p>
      <VdCard glass class="phi-card">
        <span class="phi-eq">φ = (1 + √5) ⁄ 2 = 1.6180339887…</span>
        <VdChip size="sm"><strong>Golden angle</strong> 137.5077640…°</VdChip>
        <VdChip size="sm"><strong>√φ</strong> 1.272 — type steps</VdChip>
      </VdCard>
      <div class="hero-meta">
        <span><strong>3</strong> basis classes — A / B / C</span>
        <span><strong>66</strong> components implement this spec</span>
        <span><strong>W3C APG</strong>-normative behavior</span>
        <span><strong>W3C DTCG</strong> token export</span>
      </div>
      <p class="footnote">This site is generated from the <code>vd3-ui-core</code> markdown spec and
      <code>tokens/vd3.tokens.json</code> at build time. Fix something? Open a PR — not the browser
      devtools.</p>
    </section>

    <!-- 01 CONTRACT -->
    <section id="contract">
      <h2><span class="n">01</span> The Proportional Contract <VdBadge variant="primary" pill>A/B/C</VdBadge></h2>
      <MdDoc :source="principlesMd" />
    </section>

    <!-- 02 PROPORTION -->
    <section id="proportion">
      <h2><span class="n">02</span> The Golden Spine <VdBadge variant="primary" pill>class A</VdBadge></h2>
      <ProportionDemos />
      <MdDoc :source="proportionMd" />
    </section>

    <!-- 03 SPACE -->
    <section id="space">
      <h2><span class="n">03</span> Spacing <VdBadge variant="primary" pill>class A</VdBadge> <VdBadge variant="warning" pill>C-01 small steps</VdBadge></h2>
      <p class="lead">One normative scale. Steps relate to their neighbors by ≈φ; the rhythm feels
      balanced without manual tuning. Bars below are rendered from the token values.</p>
      <SpacingDemo />
    </section>

    <!-- 04 LINE -->
    <section id="line">
      <h2><span class="n">04</span> Line Weights <VdBadge variant="primary" pill>class A</VdBadge></h2>
      <p class="lead">Four border weights from the sequence, rendered from the <code>line</code> token group.</p>
      <LineDemo />
    </section>

    <!-- 05 TYPE -->
    <section id="type">
      <h2><span class="n">05</span> Typography <VdBadge variant="primary" pill>class A</VdBadge></h2>
      <TypeDemo />
      <MdDoc :source="typographyMd" />
    </section>

    <!-- 06 MOTION -->
    <section id="motion">
      <h2><span class="n">06</span> Motion <VdBadge variant="primary" pill>class A</VdBadge></h2>
      <MotionDemo />
      <MdDoc :source="motionMd" />
    </section>

    <!-- 07 ELEVATION -->
    <section id="elevation">
      <h2><span class="n">07</span> Elevation <VdBadge variant="primary" pill>class A</VdBadge></h2>
      <p class="lead">Shadow offsets and blurs are Fibonacci pairs. Cards below use the token values verbatim.</p>
      <ElevationDemo />
      <MdDoc :source="elevationMd" />
    </section>

    <!-- 08 GLASS -->
    <section id="glass">
      <h2><span class="n">08</span> Seemore Glass <VdBadge variant="primary" pill>class A</VdBadge> <VdBadge variant="warning" pill>C-02 blur cap</VdBadge></h2>
      <p class="lead">Frosted material in Fibonacci strength steps 1 → 89. Pick a step: blur, tint, edge, and elevation move together.</p>
      <GlassDemo />
    </section>

    <!-- 09 COLOR -->
    <section id="color">
      <h2><span class="n">09</span> Color <VdBadge variant="primary" pill>class A</VdBadge> <VdBadge variant="info" pill>class B — Open Color default</VdBadge></h2>
      <p class="lead">The default palette is Open Color — battle-tested familiarity. The opt-in
      <strong>Fibonacci palette</strong> places every hue on the 137.5° wheel with golden-ratio
      lightness ramps: the same DNA as everything else on this page.</p>
      <ColorDemo />
      <div style="height: var(--vd-space-fib-21)"></div>
      <MdDoc :source="colorMd" />
    </section>

    <!-- 10 GRID -->
    <section id="grid">
      <h2><span class="n">10</span> Grid <VdBadge variant="info" pill>class B</VdBadge> <VdBadge variant="primary" pill>golden modes</VdBadge></h2>
      <p class="lead">The default grid is a conventional 12-column engine — familiar and predictable
      for forms, dashboards, and data tables. Golden layouts are one class away.</p>
      <GridDemo />
    </section>

    <!-- 11 FOUNDATIONS -->
    <section id="foundations">
      <h2><span class="n">11</span> Foundation Coverage <VdBadge variant="primary" pill>vs Carbon</VdBadge></h2>
      <p class="lead">Carbon is the completeness checklist, never the compass: each row cites where
      vd3 adopts, diverges, and why.</p>
      <FoundationTable />
    </section>

    <!-- 12 COMPONENTS -->
    <section id="components">
      <h2><span class="n">12</span> Component Specs <VdBadge variant="primary" pill>APG-normative</VdBadge></h2>
      <p class="lead">Worked example — the dialog spec, rendered from <code>components/dialog/spec.md</code>.</p>
      <MdDoc :source="dialogMd" />
    </section>
  </main>

  <footer>
    <div class="inner">
      <p><strong>vd3-ui-core</strong> · spec 2.0.0-draft · Markdown is the source of truth; this site is
      generated from it and from the DTCG token JSON, and built with <code>@vanduo-oss/vd3</code> itself.
      Library conformance: <code>"implements": "vd3-ui-core@^2.0"</code> — verified in CI.</p>
    </div>
  </footer>
</template>
