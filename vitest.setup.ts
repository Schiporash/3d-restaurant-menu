import "@testing-library/jest-dom/vitest";

// jsdom has no IntersectionObserver, which framer-motion's `whileInView` relies
// on. Stub it and report "in view" immediately so scroll-reveal content mounts
// in its final state during tests.
class IntersectionObserverStub implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(private readonly callback: IntersectionObserverCallback) {}

  observe(target: Element): void {
    this.callback(
      [{ isIntersecting: true, target, intersectionRatio: 1 } as IntersectionObserverEntry],
      this,
    );
  }

  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

globalThis.IntersectionObserver =
  IntersectionObserverStub as unknown as typeof IntersectionObserver;
