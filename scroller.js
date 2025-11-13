/*! Scroller by leggo.dev v2.1 */
function initMyScroller(selector, config = {}) {
  function setupScrollers(elements, options) {
    elements.forEach(scroller => {
      scroller.setAttribute("data-animated", true);

      const direction = options.direction || "left";
      const gap = options.gap || 2;
      const duplicates = options.duplicates || 1;
      const removeMask = options.removeMask || false;
      const pauseOnHover = options.pauseOnHover || false;
      const slowOnHover = options.slowOnHover || false;
      const slowdownFactor = options.slowdownFactor || 3;
      const pixelsPerSecond = options.pixelsPerSecond || 50;

      const wrapper = scroller.querySelector(".scroller-wrapper");

      if (removeMask) {
        scroller.setAttribute("data-mask-disabled", "true");
      }

      let orientation = "horizontal";
      let animationDirection = "normal";
      let transformProperty = "translateX";

      if (direction === "right" || direction === "down") {
        animationDirection = "reverse";
      }

      if (direction === "up" || direction === "down") {
        orientation = "vertical";
        transformProperty = "translateY";
        wrapper.style.rowGap = gap + "rem";
      } else {
        wrapper.style.columnGap = gap + "rem";
      }

      scroller.setAttribute("data-orientation", orientation);

      let distance;
      if (orientation === "vertical") {
        wrapper.style.flexDirection = 'column';
        distance = wrapper.scrollHeight;
      } else {
        wrapper.style.flexDirection = 'row';
        distance = wrapper.scrollWidth;
      }

      const calculatedDuration = distance / pixelsPerSecond;
      const translationValue = `calc(-50% - ${gap / 2}rem)`;

      const content = Array.from(wrapper.children);
      const contentSlice = content.slice();
      for (let i = 0; i < duplicates; i++) {
        contentSlice.forEach(item => {
          const duplicateNode = item.cloneNode(true);
          duplicateNode.setAttribute("aria-hidden", true);
          wrapper.appendChild(duplicateNode);
        });
      }

      const keyframes = [
        { transform: `${transformProperty}(0)` },
        { transform: `${transformProperty}(${translationValue})` }
      ];

      const timing = {
        duration: calculatedDuration * 1000,
        iterations: Infinity,
        easing: 'linear',
        direction: animationDirection
      };

      const animation = wrapper.animate(keyframes, timing);
      scroller.scrollerAnimation = animation;

      if (pauseOnHover) {
        scroller.addEventListener('mouseenter', () => animation.pause());
        scroller.addEventListener('mouseleave', () => animation.play());
      } else if (slowOnHover) {
        const slowRate = 1 / slowdownFactor;
        scroller.addEventListener('mouseenter', () => animation.playbackRate = slowRate);
        scroller.addEventListener('mouseleave', () => animation.playbackRate = 1);
      }
    });
  }

  const scrollers = document.querySelectorAll(selector);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }
  setupScrollers(scrollers, config);
}