/*! Scroller by leggo.dev v2.2 */
function initMyScroller(selector, config = {}) {
 
  let resizeTimer;
  const debouncedResize = (callback) => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(callback, 250);
  };

  function setupScroller(scroller, options) {
    destroyScroller(scroller);
    scroller.eventController = new AbortController();

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
    if (!wrapper) return; 

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

    const signal = scroller.eventController.signal;
    if (pauseOnHover) {
      scroller.addEventListener('mouseenter', () => animation.pause(), { signal });
      scroller.addEventListener('mouseleave', () => animation.play(), { signal });
    } else if (slowOnHover) {
      const slowRate = 1 / slowdownFactor;
      scroller.addEventListener('mouseenter', () => animation.playbackRate = slowRate, { signal });
      scroller.addEventListener('mouseleave', () => animation.playbackRate = 1, { signal });
    }
  }

 
  function destroyScroller(scroller) {
    scroller.scrollerAnimation?.cancel();
    
    scroller.eventController?.abort();

    scroller.removeAttribute('data-animated');
    scroller.removeAttribute('data-orientation');
    scroller.removeAttribute('data-mask-disabled');

    const wrapper = scroller.querySelector('.scroller-wrapper');
    if (wrapper && scroller.originalWrapperHTML) {
      wrapper.innerHTML = scroller.originalWrapperHTML;
      wrapper.style.rowGap = "";
      wrapper.style.columnGap = "";
      wrapper.style.flexDirection = "";
    }
  }

  
  function getActiveConfig(fullConfig) {
    const baseConfig = { ...fullConfig };
    delete baseConfig.breakpoints; 
    
    const breakpoints = fullConfig.breakpoints || {};
    const width = window.innerWidth;

    for (const bp of Object.keys(breakpoints).sort((a, b) => a - b)) {
      if (width >= bp) {
        Object.assign(baseConfig, breakpoints[bp]);
      }
    }
    return baseConfig;
  }

  function runResponsiveLogic() {
    const scrollers = document.querySelectorAll(selector);
    scrollers.forEach(scroller => {
      if (!scroller.fullConfig) return; 
      
      const newConfig = getActiveConfig(scroller.fullConfig);
      
      if (JSON.stringify(newConfig) === scroller.currentAppliedConfig) {
        return;
      }
      
      scroller.currentAppliedConfig = JSON.stringify(newConfig);
      setupScroller(scroller, newConfig);
    });
  }

  const scrollers = document.querySelectorAll(selector);
  
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    console.warn("Reduced motion preference detected. Scroller animation disabled.");
    return;
  }
  
  scrollers.forEach(scroller => {
    scroller.fullConfig = config; 
    const wrapper = scroller.querySelector('.scroller-wrapper');
    if (wrapper) {
        scroller.originalWrapperHTML = wrapper.innerHTML; 
    }
    scroller.eventController = new AbortController(); 
  });

  runResponsiveLogic();

  window.addEventListener('resize', () => debouncedResize(runResponsiveLogic));
}
