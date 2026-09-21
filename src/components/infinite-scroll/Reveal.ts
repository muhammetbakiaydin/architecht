import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText);
}

interface RevealItem {
  wrapper: HTMLElement;
  chars: Element[];
  splitText?: SplitText;
}

/** Reveal each slide (image + caption) as it enters the viewport */
export default class Reveal {
  items = new Map<HTMLElement, RevealItem>();
  container: HTMLElement | Document;

  constructor(container: HTMLElement | Document = document) {
    this.container = container;
    const slides = gsap.utils.toArray<HTMLElement>('.gallery__slide', this.container);

    slides.forEach((slide) => {
      const wrapper = slide.querySelector('.gallery__img-wrapper') as HTMLElement;
      const caption = slide.querySelector('figcaption');
      let chars: Element[] = [];
      let split: SplitText | undefined;

      if (caption) {
        split = new SplitText(caption, { type: 'chars' });
        chars = split.chars;
      }

      // Resting state: image and caption invisible
      if (wrapper) gsap.set(wrapper, { autoAlpha: 0 });
      if (chars.length) gsap.set(chars, { autoAlpha: 0 });

      this.items.set(slide, { wrapper, chars, splitText: split });
    });
  }

  /** Show slides that entered, top to bottom, reset the ones that left */
  toggle(changes: Array<{ el: HTMLElement; visible: boolean; top: number }>, immediate = false) {
    changes
      .filter((change) => change.visible)
      .sort((a, b) => a.top - b.top)
      .forEach((change, i) => this.show(change.el, i * 0.12, immediate));

    changes.filter((change) => !change.visible).forEach((change) => this.hide(change.el));
  }

  /** Fade the image in, then fade the caption in character by character */
  show(slide: HTMLElement, delay: number, immediate = false) {
    const item = this.items.get(slide);
    if (!item) return;
    const { wrapper, chars } = item;

    // The viewport moved around the slide, so there is no entrance to play
    if (immediate) {
      gsap.set([wrapper, ...chars], { autoAlpha: 1, overwrite: true });
      return;
    }

    gsap.to(wrapper, {
      autoAlpha: 1,
      duration: 1,
      ease: 'power2.out',
      delay,
      overwrite: true,
    });

    gsap.to(chars, {
      autoAlpha: 1,
      duration: 0.4,
      ease: 'none',
      stagger: 0.025,
      delay: delay + 0.2,
      overwrite: true,
    });
  }

  /** Reset instantly so the reveal replays on the next entry */
  hide(slide: HTMLElement) {
    const item = this.items.get(slide);
    if (!item) return;
    const { wrapper, chars } = item;

    gsap.set(wrapper, { autoAlpha: 0, overwrite: true });
    gsap.set(chars, { autoAlpha: 0, overwrite: true });
  }

  destroy() {
    this.items.forEach(({ splitText }) => {
      splitText?.revert();
    });
    this.items.clear();
  }
}
