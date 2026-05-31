/* ════════════════════════════════════════════
   Click-to-zoom lightbox for post-body images.

   - Wheel / pinch to zoom (toward the cursor)
   - Drag to pan
   - Double-click toggles fit ⇄ 2.5×
   - Buttons (−, fit, +), Esc, tap-outside, ✕ to close

   Uses event delegation so it survives View
   Transitions (astro:before-swap closes any open view).
════════════════════════════════════════════ */

const TRIGGER = "#article img"; // post-body images only
const ZOOM_STEP = 1.4;
const WHEEL_K = 0.0015;
const TAP_SLOP = 6; // px of movement still counted as a tap

let overlay: HTMLDivElement | null = null;
let stage!: HTMLDivElement;
let img!: HTMLImageElement;

let natW = 1;
let natH = 1;
let fit = 1;
let minS = 1;
let maxS = 1;
let scale = 1;
let tx = 0;
let ty = 0;

const pointers = new Map<number, { x: number; y: number }>();
let downTarget: EventTarget | null = null;
let downX = 0;
let downY = 0;
let moved = false;
let last: { x: number; y: number } | null = null;
let pinchPrev = 0;

const clamp = (v: number, lo: number, hi: number): number =>
  Math.min(Math.max(v, lo), hi);
const vw = (): number => window.innerWidth;
const vh = (): number => window.innerHeight;
const isOpen = (): boolean => overlay?.classList.contains("is-open") ?? false;

function apply(): void {
  img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
}

function clampPan(): void {
  const w = natW * scale;
  const h = natH * scale;
  tx = w <= vw() ? (vw() - w) / 2 : clamp(tx, vw() - w, 0);
  ty = h <= vh() ? (vh() - h) / 2 : clamp(ty, vh() - h, 0);
}

function recompute(reset: boolean): void {
  fit = Math.min(vw() / natW, vh() / natH);
  if (!isFinite(fit) || fit <= 0) fit = 1;
  minS = fit;
  maxS = Math.max(fit * 6, 2);
  if (reset) scale = fit;
  scale = clamp(scale, minS, maxS);
  clampPan();
  apply();
}

function zoomAt(cx: number, cy: number, factor: number): void {
  const ns = clamp(scale * factor, minS, maxS);
  const k = ns / scale;
  tx = cx - (cx - tx) * k;
  ty = cy - (cy - ty) * k;
  scale = ns;
  clampPan();
  apply();
}

function pointerList(): { x: number; y: number }[] {
  return [...pointers.values()];
}
function pinchDist(): number {
  const [a, b] = pointerList();
  return Math.hypot(a.x - b.x, a.y - b.y);
}
function pinchMid(): { x: number; y: number } {
  const [a, b] = pointerList();
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function build(): void {
  overlay = document.createElement("div");
  overlay.className = "lb-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Преглед на изображение");
  overlay.innerHTML = `
    <div class="lb-stage">
      <img class="lb-img" alt="" draggable="false" />
    </div>
    <div class="lb-hint">Zoom: колелце или щипка · влачи за местене · Esc за затваряне</div>
    <button class="lb-close" type="button" aria-label="Затвори">✕</button>
    <div class="lb-tools">
      <button type="button" data-act="out" aria-label="Намали">−</button>
      <button type="button" data-act="fit" aria-label="Побери в екрана">⤢</button>
      <button type="button" data-act="in" aria-label="Увеличи">+</button>
    </div>`;
  document.body.appendChild(overlay);
  stage = overlay.querySelector(".lb-stage") as HTMLDivElement;
  img = overlay.querySelector(".lb-img") as HTMLImageElement;

  img.addEventListener("load", () => {
    if (img.naturalWidth > 0) {
      natW = img.naturalWidth;
      natH = img.naturalHeight;
      recompute(true);
    }
  });

  stage.addEventListener(
    "wheel",
    (e: WheelEvent) => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * WHEEL_K));
    },
    { passive: false }
  );

  stage.addEventListener("pointerdown", (e: PointerEvent) => {
    stage.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    downTarget = e.target;
    downX = e.clientX;
    downY = e.clientY;
    moved = false;
    if (pointers.size === 1) {
      last = { x: e.clientX, y: e.clientY };
      stage.classList.add("is-grabbing");
    } else if (pointers.size === 2) {
      pinchPrev = pinchDist();
      last = null;
    }
  });

  stage.addEventListener("pointermove", (e: PointerEvent) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size >= 2) {
      const d = pinchDist();
      const c = pinchMid();
      if (pinchPrev > 0) zoomAt(c.x, c.y, d / pinchPrev);
      pinchPrev = d;
      moved = true;
    } else if (last) {
      tx += e.clientX - last.x;
      ty += e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > TAP_SLOP)
        moved = true;
      clampPan();
      apply();
    }
  });

  const endPointer = (e: PointerEvent): void => {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchPrev = 0;
    if (pointers.size === 1) {
      const p = pointerList()[0];
      last = { x: p.x, y: p.y };
    }
    if (pointers.size === 0) {
      stage.classList.remove("is-grabbing");
      last = null;
      if (!moved && downTarget === stage) close(); // tap on empty area
    }
  };
  stage.addEventListener("pointerup", endPointer);
  stage.addEventListener("pointercancel", endPointer);

  stage.addEventListener("dblclick", (e: MouseEvent) => {
    e.preventDefault();
    if (scale > fit * 1.05) recompute(true);
    else zoomAt(e.clientX, e.clientY, (fit * 2.5) / scale);
  });

  (overlay.querySelector(".lb-close") as HTMLButtonElement).addEventListener(
    "click",
    close
  );
  overlay
    .querySelectorAll<HTMLButtonElement>(".lb-tools button")
    .forEach(btn =>
      btn.addEventListener("click", () => {
        const act = btn.dataset.act;
        if (act === "in") zoomAt(vw() / 2, vh() / 2, ZOOM_STEP);
        else if (act === "out") zoomAt(vw() / 2, vh() / 2, 1 / ZOOM_STEP);
        else recompute(true);
      })
    );
}

function onResize(): void {
  if (isOpen()) recompute(false);
}

function onKey(e: KeyboardEvent): void {
  if (!isOpen()) return;
  if (e.key === "Escape") close();
  else if (e.key === "+" || e.key === "=") zoomAt(vw() / 2, vh() / 2, ZOOM_STEP);
  else if (e.key === "-") zoomAt(vw() / 2, vh() / 2, 1 / ZOOM_STEP);
  else if (e.key === "0") recompute(true);
}

function open(src: string, alt: string, nW: number, nH: number): void {
  if (!overlay || !document.body.contains(overlay)) build();
  natW = nW > 0 ? nW : 1;
  natH = nH > 0 ? nH : 1;
  img.alt = alt;
  img.src = src;
  overlay!.classList.add("is-open");
  document.documentElement.classList.add("lb-lock");
  recompute(true);
  window.addEventListener("resize", onResize);
  document.addEventListener("keydown", onKey);
}

function close(): void {
  if (!overlay) return;
  overlay.classList.remove("is-open");
  document.documentElement.classList.remove("lb-lock");
  pointers.clear();
  last = null;
  pinchPrev = 0;
  moved = false;
  stage.classList.remove("is-grabbing");
  window.removeEventListener("resize", onResize);
  document.removeEventListener("keydown", onKey);
}

// Delegated trigger — robust across View Transitions navigations.
document.addEventListener("click", (e: MouseEvent) => {
  const t = e.target;
  if (!(t instanceof HTMLImageElement)) return;
  if (!t.closest("#article") || t.closest("a")) return;
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  open(t.currentSrc || t.src, t.alt, t.naturalWidth, t.naturalHeight);
});

// Close any open viewer before client-side navigation swaps the DOM.
document.addEventListener("astro:before-swap", close);
