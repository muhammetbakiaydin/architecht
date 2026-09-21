import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import verticalLoop from './verticalLoop';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
}

export interface ToggleChange {
  el: HTMLElement;
  visible: boolean;
  top: number;
}

export interface SliderOptions {
  enabled?: () => boolean;
  onToggle?: (changes: ToggleChange[], immediate?: boolean) => void;
  container?: HTMLElement | Document;
}

interface ParallaxItem {
  el: HTMLElement;
  factor: number;
  offset: number;
  visible: boolean;
}

/** Infinite slider driven by wheel/touch scrolling */
export default class Slider {
  enabled: () => boolean;
  onToggle?: (changes: ToggleChange[], immediate?: boolean) => void;
  container: HTMLElement | Document;
  loop!: gsap.core.Timeline;
  wrap!: (value: number) => number;
  parallax: ParallaxItem[] = [];
  playhead: { time: number } = { time: 0 };
  scrub!: gsap.core.Tween;
  observer!: globalThis.Observer;
  private resizeTimer?: NodeJS.Timeout;
  private resizeListener?: () => void;

  constructor({ enabled = () => true, onToggle, container = document }: SliderOptions = {}) {
    this.enabled = enabled;
    this.onToggle = onToggle;
    this.container = container;

    this.createLoop();
    this.createParallax();
    this.createScrub();
    this.createObserver();
    this.resize();
  }

  /** Build vertical loop from the gallery slides */
  createLoop() {
    const gallery = this.container.querySelector('.gallery') as HTMLElement;
    if (!gallery) return;

    // The gap between slides doubles as the loop's bottom padding
    const gap = parseFloat(getComputedStyle(gallery).rowGap) || 0;

    // A paused one lap timeline; its playhead is our scroll position
    const slides = gsap.utils.toArray<HTMLElement>('.gallery__slide', this.container);
    this.loop = verticalLoop(slides, {
      repeat: -1,
      paused: true,
      paddingBottom: gap,
    });

    // Wrapping the playhead past either end is what makes it endless
    this.wrap = gsap.utils.wrap(0, this.loop.duration());
  }

  /** Give each slide its own travel speed for a sense of depth */
  createParallax() {
    // Speed multipliers: subtle variations for organic depth without aggressive vertical stacking
    const speeds = [1.08, 0.94, 1.05, 0.92, 1.07, 0.95];
    const slides = gsap.utils.toArray<HTMLElement>('.gallery__slide', this.container);

    this.parallax = slides.map((slide, i) => ({
      el: slide,
      factor: speeds[i % speeds.length] - 1,
      offset: 0,
      visible: false,
    }));

    // Scatter the resting positions too
    this.applyParallax();
  }

  /** Offset each slide by its speed factor, report viewport enters/leaves */
  applyParallax(immediate = false) {
    const changes: ToggleChange[] = [];

    // Read every rect BEFORE writing any transform.
    const viewportHeight = window.innerHeight;
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 848;
    const speedScale = isMobile ? 0.35 : 1;
    const rects = this.parallax.map((item) => item.el.getBoundingClientRect());

    this.parallax.forEach((item, i) => {
      const rect = rects[i];

      // The slide's position without our offset
      const loopTop = rect.top - item.offset;

      // Offset by the speed factor; zero at the wrap point
      item.offset = item.factor * speedScale * (loopTop + rect.height);
      gsap.set(item.el, { y: item.offset });

      // Check visibility from the final position
      const top = loopTop + item.offset;
      const visible = top < viewportHeight && top + rect.height > 0;

      // Collect the slides that entered or left
      if (visible !== item.visible) {
        item.visible = visible;
        changes.push({ el: item.el, visible, top });
      }
    });

    if (changes.length && this.onToggle) {
      this.onToggle(changes, immediate);
    }
  }

  /** Create the eased playhead that smooths scroll input into loop time */
  createScrub() {
    // Proxy object standing in for the scroll position
    this.playhead = { time: 0 };

    // Eases the playhead toward the latest scroll target
    this.scrub = gsap.to(this.playhead, {
      time: 0,
      duration: 0.75,
      ease: 'power3.out',
      paused: true,
      onUpdate: () => {
        if (!this.loop) return;
        this.loop.time(this.wrap(this.playhead.time));
        this.applyParallax();
      },
    });
  }

  /** Listen for wheel and touch input */
  createObserver() {
    this.observer = Observer.create({
      target: window,
      type: 'wheel,touch',
      preventDefault: true,
      onChange: (self) => {
        this.scroll(self);
      },
    });
  }

  /**
   * Rebuild the loop when the viewport WIDTH settles.
   *
   * Slide sizes are vw-based, so only a width change invalidates the
   * measurements. Rebuilding on height alone meant every mobile browser
   * toolbar slide-away tore down and re-measured the whole loop mid-scroll.
   */
  resize() {
    let lastWidth = window.innerWidth;

    this.resizeListener = () => {
      if (Math.abs(window.innerWidth - lastWidth) < 40) return;
      lastWidth = window.innerWidth;
      if (this.resizeTimer) clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.rebuild();
      }, 200);
    };

    window.addEventListener('resize', this.resizeListener);
  }

  /** Move the scrub target by the scrolled distance */
  scroll({ deltaX, deltaY }: { deltaX: number; deltaY: number }) {
    if (!this.enabled()) return;

    // Swipes (x or y) all drive the gallery
    const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

    // Slides travel 100px per playhead second, so px / 100 gives time
    (this.scrub.vars as { time: number }).time += delta / 100;
    this.scrub.invalidate().restart();
  }

  /** Freeze the inertia in place so a transition can take over */
  freeze() {
    this.scrub.pause();

    // Sync the target to where we stopped, so the next scroll ramps from here
    (this.scrub.vars as { time: number }).time = this.playhead.time;
    this.scrub.invalidate();
  }

  /** Hand the gallery over to a transition */
  stop() {
    this.observer?.disable();
    this.freeze();
  }

  /** Take the gallery back once a transition has finished with it */
  start() {
    this.observer?.enable();
  }

  /** Re-measure and rebuild the loop, preserving the current position */
  rebuild() {
    if (!this.loop) return;

    // 0 to 1 progress
    const progress = this.loop.progress();

    // Drop the old timeline and its transforms; the stagger lives in the CSS
    this.freeze();
    this.loop.kill();
    const slides = gsap.utils.toArray<HTMLElement>('.gallery__slide', this.container);
    gsap.set(slides, { clearProps: 'transform' });

    // Re-measure the new viewport size and restore the position
    this.createLoop();
    this.loop.progress(progress, true);

    // Re-measured rather than travelled, so the reveals snap, not replay
    this.parallax.forEach((item) => (item.offset = 0));
    this.applyParallax(true);

    // Re-sync the scrub to the rebuilt loop's timing
    this.playhead.time = this.loop.time();
    (this.scrub.vars as { time: number }).time = this.playhead.time;
    this.scrub.invalidate();
  }

  /** Clean up on unmount */
  destroy() {
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    if (this.resizeListener) window.removeEventListener('resize', this.resizeListener);
    this.observer?.kill();
    this.scrub?.kill();
    this.loop?.kill();
  }
}
