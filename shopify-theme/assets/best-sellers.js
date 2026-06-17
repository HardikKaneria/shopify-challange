function initBestSellersSection(section) {
  if (section.dataset.bestSellersInitialized === "true") return;
  section.dataset.bestSellersInitialized = "true";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scroller = section.querySelector('[id^="product-scroll-"]');
  const track = section.querySelector('[id^="scroll-track-"]');
  const thumb = section.querySelector('[id^="scroll-thumb-"]');

  if (scroller && track && thumb) {
    function updateThumb() {
      const trackWidth = track.clientWidth;
      if (!trackWidth || !scroller.scrollWidth) return;

      const scrollableWidth = scroller.scrollWidth - scroller.clientWidth;
      const thumbWidth = Math.max((scroller.clientWidth / scroller.scrollWidth) * trackWidth, 24);
      const maxThumbOffset = trackWidth - thumbWidth;
      const scrollRatio = scrollableWidth > 0 ? scroller.scrollLeft / scrollableWidth : 0;

      thumb.style.width = `${thumbWidth}px`;
      thumb.style.transform = `translateX(${maxThumbOffset * scrollRatio}px)`;
    }

    scroller.addEventListener("scroll", updateThumb, { passive: true });
    window.addEventListener("resize", updateThumb);
    window.addEventListener("load", updateThumb);
    window.setTimeout(updateThumb, 150);
    updateThumb();

    let isDragging = false;
    let dragStartX = 0;
    let scrollStartLeft = 0;

    function startDrag(clientX) {
      isDragging = true;
      dragStartX = clientX;
      scrollStartLeft = scroller.scrollLeft;
      track.style.height = "6px";
    }

    function dragTo(clientX) {
      if (!isDragging) return;
      const trackWidth = track.clientWidth;
      const thumbWidth = thumb.clientWidth;
      const scrollableWidth = scroller.scrollWidth - scroller.clientWidth;
      const dragRatio = (clientX - dragStartX) / (trackWidth - thumbWidth);
      scroller.scrollLeft = scrollStartLeft + dragRatio * scrollableWidth;
    }

    function endDrag() {
      isDragging = false;
      track.style.height = "";
    }

    thumb.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      startDrag(event.clientX);
      thumb.setPointerCapture(event.pointerId);
    });

    thumb.addEventListener("pointermove", (event) => dragTo(event.clientX));

    thumb.addEventListener("pointerup", endDrag);
    thumb.addEventListener("pointercancel", endDrag);
    thumb.addEventListener("lostpointercapture", endDrag);

    track.addEventListener("pointerdown", (event) => {
      if (event.target === thumb) return;
      const trackRect = track.getBoundingClientRect();
      const thumbWidth = thumb.clientWidth;
      const targetOffset = event.clientX - trackRect.left - thumbWidth / 2;
      const maxThumbOffset = track.clientWidth - thumbWidth;
      const scrollableWidth = scroller.scrollWidth - scroller.clientWidth;
      const clampedOffset = Math.min(Math.max(targetOffset, 0), maxThumbOffset);

      scroller.scrollLeft = (clampedOffset / maxThumbOffset) * scrollableWidth;
    });
  }

  section.querySelectorAll("img[data-hover-src]").forEach((img) => {
    const hoverSrc = img.dataset.hoverSrc;

    if (!hoverSrc) return;

    const parent = img.parentElement;
    if (!parent) return;

    const preloadImage = new Image();
    preloadImage.src = hoverSrc;

    parent.style.position = "relative";

    const hoverImg = document.createElement("img");
    hoverImg.src = hoverSrc;
    hoverImg.alt = "";
    hoverImg.setAttribute("aria-hidden", "true");
    hoverImg.loading = "lazy";
    hoverImg.draggable = false;
    hoverImg.className = "best-sellers__hover-image";

    parent.appendChild(hoverImg);

    const showHoverImage = () => {
      hoverImg.classList.add("is-visible");
    };

    const hideHoverImage = () => {
      hoverImg.classList.remove("is-visible");
    };

    parent.addEventListener("mouseenter", showHoverImage);
    parent.addEventListener("mouseleave", hideHoverImage);

    const cardLink = img.closest("a");

    if (cardLink) {
      cardLink.addEventListener("focusin", showHoverImage);
      cardLink.addEventListener("focusout", hideHoverImage);
    }
  });

  const showMoreButton = section.querySelector('[id^="show-more-"]');
  const extraCards = section.querySelectorAll(".best-sellers__extra");

  if (showMoreButton && extraCards.length) {
    showMoreButton.addEventListener("click", () => {
      showMoreButton.setAttribute("aria-expanded", "true");

      extraCards.forEach((card, index) => {
        card.classList.remove("hidden");
        const reveal = () => card.classList.remove("opacity-0", "translate-y-4");

        if (prefersReducedMotion) {
          reveal();
        } else {
          window.setTimeout(reveal, 50 + index * 80);
        }
      });

      const firstExtraLink = extraCards[0].querySelector("a");

      if (firstExtraLink) {
        window.setTimeout(() => firstExtraLink.focus(), prefersReducedMotion ? 0 : 150);
      }

      showMoreButton.remove();
    });
  }
}

function initAllBestSellersSections(root = document) {
  root.querySelectorAll("[data-best-sellers-section]").forEach(initBestSellersSection);
}

document.addEventListener("DOMContentLoaded", () => initAllBestSellersSections());

document.addEventListener("shopify:section:load", (event) => {
  initAllBestSellersSections(event.target);
});
