import html2canvas from 'html2canvas-pro';

/**
 * Convert an image URL to a base64 data URL via a temporary canvas.
 * Falls back to the original URL if conversion fails.
 */
async function toDataURL(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        c.getContext('2d').drawImage(img, 0, 0);
        resolve(c.toDataURL('image/png'));
      } catch {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

/**
 * Inline all cross-origin images in a cloned element as base64 data URLs
 * to prevent canvas tainting.
 */
async function inlineImages(clone) {
  const images = clone.querySelectorAll('img');
  const promises = Array.from(images).map(async (img) => {
    if (img.src && !img.src.startsWith('data:')) {
      img.src = await toDataURL(img.src);
    }
  });
  await Promise.all(promises);
}

/**
 * Resolve CSS properties that html2canvas can't handle:
 * - CSS custom properties used in `background` (especially gradients)
 * - -webkit-line-clamp and -webkit-box-orient
 */
function resolveComputedStyles(clone, original) {
  // Resolve the card's background (handles gradient themes)
  const computedBg = getComputedStyle(original).background;
  if (computedBg) {
    clone.style.background = computedBg;
  }

  // Fix -webkit-line-clamp elements — html2canvas doesn't support it,
  // so switch to standard overflow hidden
  const clampedEls = clone.querySelectorAll('.card-bio, .top-repo-desc');
  clampedEls.forEach((el) => {
    el.style.display = 'block';
    el.style.webkitLineClamp = 'unset';
    el.style.webkitBoxOrient = 'unset';
    el.style.overflow = 'visible';
  });

  // Resolve backgrounds on inner elements that use CSS vars
  const innerEls = clone.querySelectorAll(
    '.stat-badge, .streak-card, .card-advanced-stats, .top-repo-spotlight, .pinned-repo-item'
  );
  const origInnerEls = original.querySelectorAll(
    '.stat-badge, .streak-card, .card-advanced-stats, .top-repo-spotlight, .pinned-repo-item'
  );
  innerEls.forEach((el, i) => {
    if (origInnerEls[i]) {
      const cs = getComputedStyle(origInnerEls[i]);
      el.style.background = cs.background;
      el.style.backgroundColor = cs.backgroundColor;
      el.style.borderColor = cs.borderColor;
    }
  });
}

export async function exportAsPng(element, filename = 'gitglance-card.png') {
  // Clone the element so we can modify it without affecting the live DOM
  const clone = element.cloneNode(true);

  // Copy the data-theme attribute so themed CSS vars are applied
  clone.setAttribute('data-theme', element.getAttribute('data-theme') || 'geist');

  // Temporarily attach the clone off-screen for computed style access
  clone.style.position = 'fixed';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.zIndex = '-1';
  clone.style.width = element.offsetWidth + 'px';
  document.body.appendChild(clone);

  try {
    // Inline cross-origin images as base64
    await inlineImages(clone);

    // Resolve CSS custom properties and unsupported CSS
    resolveComputedStyles(clone, element);

    const canvas = await html2canvas(clone, {
      backgroundColor: '#000000',
      scale: 2,
      useCORS: false,       // Not needed since we inlined images as data URLs
      allowTaint: false,
      logging: false,
      width: element.offsetWidth,
      height: element.offsetHeight,
      windowWidth: element.offsetWidth,
      windowHeight: element.offsetHeight,
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } finally {
    // Always clean up the off-screen clone
    document.body.removeChild(clone);
  }
}
