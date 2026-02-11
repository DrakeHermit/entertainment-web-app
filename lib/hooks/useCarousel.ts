import { useRef, useCallback } from "react";

export const useCarousel = () => { 
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const prevTranslate = useRef(0);
  const currentTranslate = useRef(0);

  const getMaxScroll = useCallback(() => {
    if (!trackRef.current || !containerRef.current) return 0;
    const trackWidth = trackRef.current.scrollWidth;
    const containerWidth = containerRef.current.clientWidth;
    return -(trackWidth - containerWidth);
  }, []);

  const setPosition = useCallback(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    trackRef.current?.style.setProperty("transition", "none");

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;

    e.preventDefault();

    const diff = e.clientX - startX.current;
    currentTranslate.current = prevTranslate.current + diff;

    const maxScroll = getMaxScroll();
    if (currentTranslate.current > 0) {
      currentTranslate.current = currentTranslate.current * 0.3;
    } else if (currentTranslate.current < maxScroll) {
      const overscroll = currentTranslate.current - maxScroll;
      currentTranslate.current = maxScroll + overscroll * 0.3;
    }

    setPosition();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    trackRef.current?.style.setProperty(
      "transition",
      "transform 0.3s ease-out",
    );

    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    const maxScroll = getMaxScroll();
    if (currentTranslate.current > 0) {
      currentTranslate.current = 0;
    } else if (currentTranslate.current < maxScroll) {
      currentTranslate.current = maxScroll;
    }

    prevTranslate.current = currentTranslate.current;
    setPosition();
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    handlePointerUp(e);
  };

  return {
    containerRef,
    trackRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  };
};