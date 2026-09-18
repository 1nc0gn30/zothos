<script>
  import { onMount } from 'svelte';

  const faqs = [
    ['How fast can a launch ship?', 'Most focused launch systems are live in four to six weeks, with campaign pages and measurement online first.'],
    ['Do you work with existing brand systems?', 'Yes. We can extend an existing identity, tighten the component system, or build a lean refresh when the current visual language is blocking growth.'],
    ['What happens after launch?', 'We monitor funnel signals, run creative tests, and keep improving the site as real customer behavior comes in.'],
  ];

  let openIndex = 0;
  let billing = 'monthly';
  let theme = 'light';

  onMount(() => {
    document.documentElement.setAttribute('data-theme', theme);
  });

  $: if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
</script>

<div class="state-panel" aria-label="Site controls">
  <div class="segmented" role="tablist" aria-label="Billing cadence">
    <button class:active={billing === 'monthly'} on:click={() => billing = 'monthly'}>Monthly</button>
    <button class:active={billing === 'quarterly'} on:click={() => billing = 'quarterly'}>Quarterly</button>
  </div>
  <button class="theme-toggle" aria-label="Toggle color theme" on:click={() => theme = theme === 'light' ? 'dark' : 'light'}>
    {theme === 'light' ? 'Dark' : 'Light'}
  </button>
</div>

<section class="pricing" id="pricing" aria-labelledby="pricing-title">
  <div class="section-kicker">Engagements</div>
  <div class="section-heading">
    <h2 id="pricing-title">Choose the operating rhythm.</h2>
    <p>Each plan includes strategy, creative direction, implementation, and reporting.</p>
  </div>
  <div class="pricing-grid">
    <article>
      <span>Launch</span>
      <strong>{billing === 'monthly' ? '$8k' : '$21k'}</strong>
      <p>For founders who need a sharp campaign and site foundation.</p>
    </article>
    <article class="featured">
      <span>Scale</span>
      <strong>{billing === 'monthly' ? '$14k' : '$38k'}</strong>
      <p>For teams building an always-on growth and content engine.</p>
    </article>
    <article>
      <span>Studio</span>
      <strong>Custom</strong>
      <p>For product lines that need embedded creative systems support.</p>
    </article>
  </div>
</section>

<section class="faq" id="faq" aria-labelledby="faq-title">
  <div class="section-kicker">Questions</div>
  <div class="section-heading">
    <h2 id="faq-title">Straight answers before kickoff.</h2>
  </div>
  <div class="faq-list">
    {#each faqs as faq, index}
      <article class:open={openIndex === index}>
        <button aria-expanded={openIndex === index} on:click={() => openIndex = openIndex === index ? -1 : index}>
          <span>{faq[0]}</span>
          <span aria-hidden="true">{openIndex === index ? '−' : '+'}</span>
        </button>
        {#if openIndex === index}
          <p>{faq[1]}</p>
        {/if}
      </article>
    {/each}
  </div>
</section>
