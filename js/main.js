document.addEventListener("DOMContentLoaded", () => {
  const scroller = document.getElementById("product-scroll");
  const track = document.getElementById("scroll-track");
  const thumb = document.getElementById("scroll-thumb");

  if (!scroller || !track || !thumb) return;

  function updateThumb() {
    const trackWidth = track.clientWidth;
    const scrollableWidth = scroller.scrollWidth - scroller.clientWidth;
    const thumbWidth = Math.max((scroller.clientWidth / scroller.scrollWidth) * trackWidth, 24);
    const maxThumbOffset = trackWidth - thumbWidth;
    const scrollRatio = scrollableWidth > 0 ? scroller.scrollLeft / scrollableWidth : 0;

    thumb.style.width = `${thumbWidth}px`;
    thumb.style.transform = `translateX(${maxThumbOffset * scrollRatio}px)`;
  }

  scroller.addEventListener("scroll", updateThumb);
  window.addEventListener("resize", updateThumb);
  updateThumb();

  let isDragging = false;
  let dragStartX = 0;
  let scrollStartLeft = 0;

  function startDrag(clientX) {
    isDragging = true;
    dragStartX = clientX;
    scrollStartLeft = scroller.scrollLeft;
  }

  function dragTo(clientX) {
    if (!isDragging) return;
    const trackWidth = track.clientWidth;
    const thumbWidth = thumb.clientWidth;
    const scrollableWidth = scroller.scrollWidth - scroller.clientWidth;
    const dragRatio = (clientX - dragStartX) / (trackWidth - thumbWidth);
    scroller.scrollLeft = scrollStartLeft + dragRatio * scrollableWidth;
  }

  thumb.addEventListener("pointerdown", (event) => {
    startDrag(event.clientX);
    thumb.setPointerCapture(event.pointerId);
  });

  thumb.addEventListener("pointermove", (event) => dragTo(event.clientX));

  thumb.addEventListener("pointerup", () => {
    isDragging = false;
  });

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

  document.querySelectorAll("img[data-hover-src]").forEach((img) => {
    const hoverSrc = img.dataset.hoverSrc;

    if (!hoverSrc) return;

    const parent = img.parentElement;
    if (!parent) return;

    // Preload hover image
    const preloadImage = new Image();
    preloadImage.src = hoverSrc;

    // Make sure parent can hold absolute hover image
    parent.style.position = "relative";

    // Primary image transition
    img.style.transition = "opacity 300ms ease";
    img.style.display = "block";

    // Create hover image layer
    const hoverImg = document.createElement("img");
    hoverImg.src = hoverSrc;
    hoverImg.alt = "";
    hoverImg.setAttribute("aria-hidden", "true");
    hoverImg.loading = "lazy";
    hoverImg.draggable = false;

    hoverImg.style.position = "absolute";
    hoverImg.style.inset = "0";
    hoverImg.style.width = "100%";
    hoverImg.style.height = "100%";
    hoverImg.style.objectFit = "cover";
    hoverImg.style.opacity = "0";
    hoverImg.style.transition = "opacity 300ms ease";
    hoverImg.style.pointerEvents = "none";

    parent.appendChild(hoverImg);

    const showHoverImage = () => {
      hoverImg.style.opacity = "1";
    };

    const hideHoverImage = () => {
      hoverImg.style.opacity = "0";
    };

    parent.addEventListener("mouseenter", showHoverImage);
    parent.addEventListener("mouseleave", hideHoverImage);

    const cardLink = img.closest("a");

    if (cardLink) {
      cardLink.addEventListener("focusin", showHoverImage);
      cardLink.addEventListener("focusout", hideHoverImage);
    }
  });

  const showMoreButton = document.getElementById("show-more");
  const extraCards = document.querySelectorAll(".product-extra");

  if (showMoreButton && extraCards.length) {
    showMoreButton.addEventListener("click", () => {
      extraCards.forEach((card, index) => {
        card.classList.remove("hidden");

        window.setTimeout(() => {
          card.classList.remove("opacity-0", "translate-y-4");
        }, 50 + index * 80);
      });

      showMoreButton.remove();
    });
  }
});
