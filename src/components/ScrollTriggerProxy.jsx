// To use gsap with loco scroll, we have to use scroller proxy provided by gsap
import gsap from 'gsap';
import { useEffect } from 'react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useLocomotiveScroll } from 'react-locomotive-scroll';

const ScrollTriggerProxy = () => {
  const { scroll } = useLocomotiveScroll();

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    if (scroll) {
      const element = scroll?.el;

      scroll.on('scroll', ScrollTrigger.update);

      // Tell ScrollTrigger to use these proxy getter/setter methods for the "body" element:
      ScrollTrigger.scrollerProxy(element, {
        scrollTop(value) {
          return arguments.length
            ? scroll.scrollTo(value, 0, 0)
            : scroll.scroll.instance.scroll.y;
        },

        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },

        // when the smooth scroller updates, tell ScrollTrigger to update() too:
        pinType: document.querySelector(element).style.transform
          ? 'transform'
          : 'fixed',
      });
    }

    return () => {
      ScrollTrigger.addEventListener('refresh', () => scroll?.update());
      ScrollTrigger.refresh();
    };
  }, [scroll]);

  return null;
};

export default ScrollTriggerProxy;
