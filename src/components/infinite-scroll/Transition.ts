import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { SplitText } from 'gsap/SplitText';
import { Observer } from 'gsap/Observer';
import type { GallerySlide } from './types';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Flip, SplitText, Observer);
}

export interface TransitionOptions {
  onClose?: () => void;
  container?: HTMLElement | Document;
  /** The same list the gallery rendered, in the same order. */
  slides: GallerySlide[];
}

/** Two-digit counter label: 1 -> "01", 12 -> "12". */
const pad = (value: number) => String(value).padStart(2, '0');

/** Image-to-content transition with multi-photo scroll navigation */
export default class Transition {
  onClose?: () => void;
  container: HTMLElement | Document;
  data: GallerySlide[];
  content!: HTMLElement;
  preview!: HTMLElement;
  previewImg!: HTMLImageElement;
  previewSecondaryImg: HTMLImageElement | null = null;
  prevBtn: HTMLElement | null = null;
  nextBtn: HTMLElement | null = null;
  counterEl: HTMLElement | null = null;
  counterCurrentEl: HTMLElement | null = null;
  counterTotalEl: HTMLElement | null = null;
  counterBarEl: HTMLElement | null = null;
  groups: HTMLElement[] = [];
  slides: HTMLElement[] = [];
  activeSlide: HTMLElement | null = null;
  activeProjectIndex: number = -1;
  activeSubSlideIndex: number = 0;
  isSubTransitioning: boolean = false;
  detailObserver: globalThis.Observer | null = null;
  detailKeyHandler: ((e: KeyboardEvent) => void) | null = null;
  touchStartHandler: ((e: TouchEvent) => void) | null = null;
  touchMoveHandler: ((e: TouchEvent) => void) | null = null;
  touchEndHandler: ((e: TouchEvent) => void) | null = null;
  touchCancelHandler: ((e: TouchEvent) => void) | null = null;
  pointerDownHandler: ((e: PointerEvent) => void) | null = null;
  pointerMoveHandler: ((e: PointerEvent) => void) | null = null;
  pointerUpHandler: ((e: PointerEvent) => void) | null = null;
  lastSwipeTime: number = 0;
  tl: gsap.core.Timeline | null = null;
  split: SplitText | null = null;
  state: 'closed' | 'opening' | 'open' | 'closing' = 'closed';

  constructor({ onClose, container = document, slides }: TransitionOptions) {
    this.onClose = onClose;
    this.container = container;
    this.data = slides;

    this.content = this.container.querySelector('.content') as HTMLElement;
    this.preview = this.container.querySelector('.content__preview-img') as HTMLElement;
    this.previewImg = (this.preview.querySelector('.preview-img-primary') ||
      this.preview.querySelector('img')) as HTMLImageElement;
    this.previewSecondaryImg = this.preview.querySelector(
      '.preview-img-secondary'
    ) as HTMLImageElement | null;

    this.prevBtn = this.preview.querySelector('.content__nav-btn--prev');
    this.nextBtn = this.preview.querySelector('.content__nav-btn--next');

    this.prevBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.goToSubSlide(this.activeSubSlideIndex - 1);
    });
    this.nextBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.goToSubSlide(this.activeSubSlideIndex + 1);
    });

    // Tap on the image to advance (left 35% prev, right 65% next)
    this.preview.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.content__nav-btn')) return;
      if (Date.now() - this.lastSwipeTime < 450) return;
      const rect = this.preview.getBoundingClientRect();
      const clickX = (e as MouseEvent).clientX - rect.left;
      if (clickX < rect.width * 0.35) {
        this.goToSubSlide(this.activeSubSlideIndex - 1);
      } else {
        this.goToSubSlide(this.activeSubSlideIndex + 1);
      }
    });

    this.counterEl = this.container.querySelector('.content__counter');
    this.counterCurrentEl = this.container.querySelector('.content__counter-current');
    this.counterTotalEl = this.container.querySelector('.content__counter-total');
    this.counterBarEl = this.container.querySelector('.content__counter-bar');

    this.counterEl?.addEventListener('click', () => {
      this.goToSubSlide(this.activeSubSlideIndex + 1);
    });

    this.groups = gsap.utils.toArray<HTMLElement>('.content__group', this.container);
    this.slides = gsap.utils.toArray<HTMLElement>('.gallery__slide', this.container);

    this.preview.dataset.flipId = 'preview';
  }

  /** Animate to preview */
  async open(slide: HTMLElement, index: number) {
    if (this.state !== 'closed') return;
    this.state = 'opening';
    this.activeSlide = slide;
    this.activeProjectIndex = index;
    this.activeSubSlideIndex = 0;

    await this.fillContent(slide, index);

    // A close() landing while the preview decoded has already reset us
    if (this.state !== 'opening') return;

    const { wrapper, caption, others } = this.parts();
    wrapper.dataset.flipId = 'preview';

    // Capture the thumbnail's bounds before the layout changes
    const state = Flip.getState(wrapper);

    // Show the detail layout and hide the thumbnail, killing its reveal tween
    gsap.set(this.content, { display: 'block' });
    gsap.killTweensOf(wrapper);
    gsap.set(wrapper, { autoAlpha: 0 });

    // Split the text into lines and characters (active text group only, not fixed buttons)
    const targetElements = this.container.querySelectorAll(
      '.content__group.active > *'
    );
    this.split = new SplitText(targetElements, {
      type: 'lines,chars',
      charsClass: 'char',
    });

    this.tl = gsap
      .timeline({
        onComplete: () => {
          this.state = 'open';
          this.createDetailObserver();
        },
        // Fires when a cancelled open finishes rewinding
        onReverseComplete: () => this.reset(),
      })
      // Fade out the other slides and the caption
      .to(others, { autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, 0)
      .to(caption, { autoAlpha: 0, duration: 0.3, ease: 'power2.out' }, 0)
      // Morph the selected image
      .add(
        Flip.from(state, {
          targets: this.preview,
          duration: 1.2,
          ease: 'power4.inOut',
          absolute: true,
        }) as gsap.core.Animation,
        0
      )
      .to(this.previewImg, { scale: 1, duration: 1.2, ease: 'power4.inOut' }, 0);

    // Fade back button in smoothly
    const backBtn = this.container.querySelector('.content__back');
    if (backBtn) {
      this.tl.fromTo(
        backBtn,
        { autoAlpha: 0, scale: 0.9 },
        { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power2.out' },
        0.6
      );
    }

    // Fade photo nav buttons in if multi-photo
    const project = this.data[index];
    const total = project?.gallery?.length || 1;
    if (total > 1 && this.prevBtn && this.nextBtn) {
      gsap.set([this.prevBtn, this.nextBtn], { display: 'flex' });
      this.tl.fromTo(
        [this.prevBtn, this.nextBtn],
        { autoAlpha: 0, scale: 0.8 },
        { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power2.out' },
        0.8
      );
    }

    // Fade the text in character by character, one line after another
    if (this.split.lines) {
      this.split.lines.forEach((line: Element, i: number) => {
        this.tl?.fromTo(
          line.querySelectorAll('.char'),
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.01,
          },
          // Preview delay + line index * stagger delay
          0.8 + i * 0.06
        );
      });
    }

    // Fade the counter indicator in right alongside the preview edge
    if (this.counterEl) {
      this.tl.fromTo(
        this.counterEl,
        { autoAlpha: 0, x: -15 },
        { autoAlpha: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        0.85
      );
    }
  }

  /** Animate the preview back into its slide */
  close() {
    // Close mid-animation
    if (this.state === 'opening') {
      this.state = 'closing';
      this.destroyDetailObserver();

      // Still waiting on the decode, so there is no timeline to rewind
      if (!this.tl) {
        this.reset();
        return;
      }

      this.tl.reverse();
      return;
    }

    if (this.state !== 'open') return;
    this.state = 'closing';
    this.destroyDetailObserver();

    // Fade out counter quickly
    if (this.counterEl) {
      gsap.to(this.counterEl, { autoAlpha: 0, duration: 0.25, ease: 'power2.out' });
    }

    const backBtn = this.container.querySelector('.content__back');
    if (backBtn) {
      gsap.to(backBtn, { autoAlpha: 0, duration: 0.25, ease: 'power2.out' });
    }
    if (this.prevBtn && this.nextBtn) {
      gsap.to([this.prevBtn, this.nextBtn], { autoAlpha: 0, duration: 0.25, ease: 'power2.out' });
    }

    // If navigated to another sub-photo, restore main thumbnail photo so Flip morph matches
    const originalSrc = this.data[this.activeProjectIndex]?.image;
    if (originalSrc && this.previewImg && this.previewImg.src !== originalSrc) {
      this.previewImg.src = originalSrc;
    }
    if (this.previewSecondaryImg) {
      gsap.set(this.previewSecondaryImg, { autoAlpha: 0 });
    }

    const { wrapper, caption, others } = this.parts();

    this.tl = gsap
      .timeline({ onComplete: () => this.reset() })
      // Fade the text out line by line
      .to(
        this.split?.lines || [],
        { autoAlpha: 0, duration: 0.4, stagger: 0.04, ease: 'power1.out' },
        0
      )
      // Morph the preview back into the thumbnail's bounds
      .add(
        Flip.fit(this.preview, wrapper, {
          duration: 1,
          ease: 'power3.inOut',
          absolute: true,
        }) as gsap.core.Animation,
        0
      )
      .to(this.previewImg, { scale: 1.2, duration: 1, ease: 'power3.inOut' }, 0)
      // Fade the other slides and caption back in
      .to(others, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 0.5)
      .to(caption, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, 0.6);
  }

  /** Set up wheel, touch, and keyboard observer while detail view is open */
  createDetailObserver() {
    this.destroyDetailObserver();

    // 1. Direct Touch & Pointer Gestures for mobile (100% reliable swipe detection)
    let touchStartX = 0;
    let touchStartY = 0;
    let touchLastX = 0;
    let touchLastY = 0;
    let touchStartTime = 0;
    let isTracking = false;

    const onStart = (clientX: number, clientY: number) => {
      touchStartX = clientX;
      touchStartY = clientY;
      touchLastX = clientX;
      touchLastY = clientY;
      touchStartTime = Date.now();
      isTracking = true;
    };

    const onMove = (clientX: number, clientY: number) => {
      if (!isTracking) return;
      touchLastX = clientX;
      touchLastY = clientY;
    };

    const onEnd = (clientX?: number, clientY?: number) => {
      if (!isTracking) return;
      isTracking = false;
      if (this.state !== 'open' || this.isSubTransitioning) return;

      if (clientX !== undefined) touchLastX = clientX;
      if (clientY !== undefined) touchLastY = clientY;

      const deltaX = touchLastX - touchStartX;
      const deltaY = touchLastY - touchStartY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const timeDiff = Date.now() - touchStartTime;

      if (Math.max(absX, absY) >= 20 && timeDiff < 1200) {
        this.lastSwipeTime = Date.now();
        if (absY > absX) {
          // Vertical swipe: Swiping UP (deltaY < 0) => Next photo; Swiping DOWN (deltaY > 0) => Prev photo
          if (deltaY < -20) {
            this.goToSubSlide(this.activeSubSlideIndex + 1);
          } else if (deltaY > 20) {
            this.goToSubSlide(this.activeSubSlideIndex - 1);
          }
        } else {
          // Horizontal swipe: Swiping LEFT (deltaX < 0) => Next photo; Swiping RIGHT (deltaX > 0) => Prev photo
          if (deltaX < -20) {
            this.goToSubSlide(this.activeSubSlideIndex + 1);
          } else if (deltaX > 20) {
            this.goToSubSlide(this.activeSubSlideIndex - 1);
          }
        }
      }
    };

    // Touch events for real touch devices
    this.touchStartHandler = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        onStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    this.touchMoveHandler = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    this.touchEndHandler = (e: TouchEvent) => {
      if (e.changedTouches.length > 0) {
        onEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      } else {
        onEnd();
      }
    };
    this.touchCancelHandler = () => {
      onEnd();
    };

    window.addEventListener('touchstart', this.touchStartHandler, { passive: true });
    window.addEventListener('touchmove', this.touchMoveHandler, { passive: true });
    window.addEventListener('touchend', this.touchEndHandler, { passive: true });
    window.addEventListener('touchcancel', this.touchCancelHandler, { passive: true });

    // Pointer events (handles DevTools device emulation and modern pointer drag)
    this.pointerDownHandler = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      onStart(e.clientX, e.clientY);
    };
    this.pointerMoveHandler = (e: PointerEvent) => {
      onMove(e.clientX, e.clientY);
    };
    this.pointerUpHandler = (e: PointerEvent) => {
      onEnd(e.clientX, e.clientY);
    };

    window.addEventListener('pointerdown', this.pointerDownHandler, { passive: true });
    window.addEventListener('pointermove', this.pointerMoveHandler, { passive: true });
    window.addEventListener('pointerup', this.pointerUpHandler, { passive: true });
    window.addEventListener('pointercancel', this.pointerUpHandler, { passive: true });

    // 2. Desktop Mouse Wheel / Trackpad ONLY
    this.detailObserver = Observer.create({
      target: window,
      type: 'wheel',
      preventDefault: false,
      tolerance: 15,
      onChange: (self) => {
        if (this.state !== 'open' || this.isSubTransitioning) return;
        const delta = Math.abs(self.deltaX) > Math.abs(self.deltaY) ? self.deltaX : self.deltaY;
        if (delta > 20) {
          this.goToSubSlide(this.activeSubSlideIndex + 1);
        } else if (delta < -20) {
          this.goToSubSlide(this.activeSubSlideIndex - 1);
        }
      },
    });

    // 3. Keyboard Arrow Navigation
    this.detailKeyHandler = (e: KeyboardEvent) => {
      if (this.state !== 'open' || this.isSubTransitioning) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        this.goToSubSlide(this.activeSubSlideIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        this.goToSubSlide(this.activeSubSlideIndex - 1);
      }
    };
    window.addEventListener('keydown', this.detailKeyHandler);
  }

  destroyDetailObserver() {
    this.detailObserver?.kill();
    this.detailObserver = null;
    if (this.detailKeyHandler) {
      window.removeEventListener('keydown', this.detailKeyHandler);
      this.detailKeyHandler = null;
    }
    if (this.touchStartHandler) {
      window.removeEventListener('touchstart', this.touchStartHandler);
      this.touchStartHandler = null;
    }
    if (this.touchMoveHandler) {
      window.removeEventListener('touchmove', this.touchMoveHandler);
      this.touchMoveHandler = null;
    }
    if (this.touchEndHandler) {
      window.removeEventListener('touchend', this.touchEndHandler);
      this.touchEndHandler = null;
    }
    if (this.touchCancelHandler) {
      window.removeEventListener('touchcancel', this.touchCancelHandler);
      this.touchCancelHandler = null;
    }
    if (this.pointerDownHandler) {
      window.removeEventListener('pointerdown', this.pointerDownHandler);
      this.pointerDownHandler = null;
    }
    if (this.pointerMoveHandler) {
      window.removeEventListener('pointermove', this.pointerMoveHandler);
      this.pointerMoveHandler = null;
    }
    if (this.pointerUpHandler) {
      window.removeEventListener('pointerup', this.pointerUpHandler);
      window.removeEventListener('pointercancel', this.pointerUpHandler);
      this.pointerUpHandler = null;
    }
  }

  /** Transition to a specific sub-photo and update text + counter */
  goToSubSlide(targetIndex: number) {
    const project = this.data[this.activeProjectIndex];
    if (!project || !project.gallery || project.gallery.length <= 1) return;

    const total = project.gallery.length;
    // Seamless wrapping
    if (targetIndex < 0) targetIndex = total - 1;
    if (targetIndex >= total) targetIndex = 0;
    if (targetIndex === this.activeSubSlideIndex) return;

    this.isSubTransitioning = true;
    setTimeout(() => {
      this.isSubTransitioning = false;
    }, 600);
    const prevIndex = this.activeSubSlideIndex;
    this.activeSubSlideIndex = targetIndex;
    const targetSlide = project.gallery[targetIndex];
    const goingDown = targetIndex > prevIndex;

    // 1. Update Counter Indicator
    if (this.counterCurrentEl) {
      gsap.to(this.counterCurrentEl, {
        y: goingDown ? -12 : 12,
        autoAlpha: 0,
        duration: 0.18,
        ease: 'power2.in',
        onComplete: () => {
          if (this.counterCurrentEl) {
            this.counterCurrentEl.textContent = pad(targetIndex + 1);
            gsap.fromTo(
              this.counterCurrentEl,
              { y: goingDown ? 12 : -12, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.28, ease: 'power2.out' }
            );
          }
        },
      });
    }

    if (this.counterBarEl) {
      // A CSS custom property, eased by the stylesheet, so the same call fills
      // the bar downwards on desktop and rightwards on the mobile layout.
      const percent = ((targetIndex + 1) / total) * 100;
      this.counterBarEl.style.setProperty('--counter-fill', `${percent}%`);
    }

    // 2. Cross-fade photo in preview
    if (this.previewSecondaryImg && this.previewImg) {
      this.previewSecondaryImg.src = targetSlide.image;
      gsap.killTweensOf([this.previewImg, this.previewSecondaryImg]);
      gsap.fromTo(
        this.previewSecondaryImg,
        { autoAlpha: 0, scale: 1.06 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.65,
          ease: 'power3.out',
          onComplete: () => {
            if (this.previewImg && this.previewSecondaryImg) {
              this.previewImg.src = targetSlide.image;
              gsap.set(this.previewSecondaryImg, { autoAlpha: 0 });
            }
          },
        }
      );
    } else if (this.previewImg) {
      this.previewImg.src = targetSlide.image;
    }

    // 3. Animate Subtitle and Description
    const activeGroup = this.container.querySelector(
      `.content__group[data-index="${this.activeProjectIndex}"]`
    );
    if (activeGroup) {
      const titleEl = activeGroup.querySelector('.content__title');
      const subtitleEl = activeGroup.querySelector('.content__subtitle');
      const descEl = activeGroup.querySelector('.content__description');
      const targets = [subtitleEl, descEl].filter(Boolean);

      gsap.to(targets, {
        autoAlpha: 0,
        y: goingDown ? -8 : 8,
        duration: 0.18,
        stagger: 0.02,
        ease: 'power2.in',
        onComplete: () => {
          if (titleEl && targetSlide.title && targetSlide.title !== titleEl.textContent) {
            titleEl.textContent = targetSlide.title;
          }
          if (subtitleEl) subtitleEl.textContent = targetSlide.subtitle || '';
          if (descEl) descEl.textContent = targetSlide.description;

          gsap.fromTo(
            targets,
            { autoAlpha: 0, y: goingDown ? 8 : -8 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.38,
              stagger: 0.04,
              ease: 'power3.out',
              onComplete: () => {
                this.isSubTransitioning = false;
              },
            }
          );
        },
      });
    } else {
      setTimeout(() => {
        this.isSubTransitioning = false;
      }, 500);
    }
  }

  /** Copy the clicked image into the preview and activate its content group */
  async fillContent(slide: HTMLElement, index: number) {
    const img = slide.querySelector('.gallery__img') as HTMLImageElement;
    if (!img) return;

    const project = this.data[index];
    const initialPhoto = project?.gallery?.[0]?.image || img.src;

    // Same src as the thumbnail
    this.previewImg.src = initialPhoto;
    this.previewImg.alt = img.alt || '';

    if (this.previewSecondaryImg) {
      gsap.set(this.previewSecondaryImg, { autoAlpha: 0 });
    }

    this.groups.forEach((group) =>
      group.classList.toggle('active', Number(group.dataset.index) === index)
    );

    // Reset initial text
    const activeGroup = this.container.querySelector(`.content__group[data-index="${index}"]`);
    if (activeGroup && project?.gallery?.[0]) {
      const categoryEl = activeGroup.querySelector('.content__category');
      const titleEl = activeGroup.querySelector('.content__title');
      const subtitleEl = activeGroup.querySelector('.content__subtitle');
      const descEl = activeGroup.querySelector('.content__description');
      if (categoryEl) categoryEl.textContent = project.category || 'MİMARİ & İÇ MEKAN';
      if (titleEl) titleEl.textContent = project.title;
      if (subtitleEl) subtitleEl.textContent = project.gallery[0].subtitle || '';
      if (descEl) descEl.textContent = project.gallery[0].description;
    }

    // Reset counter values
    const total = project?.gallery?.length || 1;
    if (this.counterCurrentEl) this.counterCurrentEl.textContent = pad(1);
    if (this.counterTotalEl) this.counterTotalEl.textContent = pad(total);
    if (this.counterBarEl) {
      this.counterBarEl.style.setProperty('--counter-fill', `${(1 / total) * 100}%`);
    }

    if (this.prevBtn) this.prevBtn.style.display = total > 1 ? 'flex' : 'none';
    if (this.nextBtn) this.nextBtn.style.display = total > 1 ? 'flex' : 'none';

    // Undecoded, the preview paints blank for the first frames of the morph
    try {
      await this.previewImg.decode();
    } catch {
      // Rejects if the src is swapped mid-flight; the transition still runs
    }
  }

  /** Collect the pieces of the active slide the animations need */
  parts() {
    const slide = this.activeSlide!;

    return {
      // Flip target
      wrapper: slide.querySelector('.gallery__img-wrapper') as HTMLElement,
      // Title under the image
      caption: slide.querySelector('figcaption') as HTMLElement,
      // Other slide items
      others: this.slides.filter((s) => s !== slide),
    };
  }

  /** Restore the DOM */
  reset() {
    this.destroyDetailObserver();

    if (this.activeSlide) {
      const { wrapper } = this.parts();
      // The thumbnail only carries the Flip id while its slide is expanded
      delete wrapper.dataset.flipId;
      gsap.set(wrapper, { clearProps: 'all' });
    }

    // Revert split
    this.split?.revert();
    this.split = null;

    // Hide the overlay and clear style the animations left
    const backBtn = this.container.querySelector('.content__back');
    if (backBtn) gsap.set(backBtn, { clearProps: 'all' });
    if (this.prevBtn) {
      this.prevBtn.style.display = 'none';
      gsap.set(this.prevBtn, { clearProps: 'all' });
    }
    if (this.nextBtn) {
      this.nextBtn.style.display = 'none';
      gsap.set(this.nextBtn, { clearProps: 'all' });
    }

    gsap.set(this.content, { display: 'none' });
    gsap.set(this.preview, { clearProps: 'all' });
    gsap.set(this.previewImg, { clearProps: 'all' });
    if (this.previewSecondaryImg) {
      gsap.set(this.previewSecondaryImg, { autoAlpha: 0, clearProps: 'all' });
    }
    if (this.counterEl) {
      gsap.set(this.counterEl, { autoAlpha: 0, clearProps: 'all' });
    }

    this.activeSlide = null;
    this.activeProjectIndex = -1;
    this.activeSubSlideIndex = 0;
    this.tl = null;
    this.state = 'closed';

    this.onClose?.();
  }

  destroy() {
    this.destroyDetailObserver();
    this.tl?.kill();
    this.split?.revert();
    this.reset();
  }
}
