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
    const primarySrc = img.src;
    const hoverSrc = img.dataset.hoverSrc;

    new Image().src = hoverSrc;

    img.addEventListener("mouseenter", () => {
      img.src = hoverSrc;
    });

    img.addEventListener("mouseleave", () => {
      img.src = primarySrc;
    });
  });
});
