'use client';

import * as React from 'react';

const getIsTouchDevice = (): boolean => {
  const hasTouchEvent = 'ontouchstart' in window;
  const hasTouchPoints = navigator.maxTouchPoints > 0;
  const hasCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;

  return hasTouchEvent || hasTouchPoints || hasCoarsePointer;
};

/**
 * Ported from the Codrops "Infinite Canvas" demo.
 *
 * Starts at `false` rather than probing during the initial render: a client
 * component is still rendered on the server, where `window` does not exist.
 * The real value lands in the first effect, before the canvas mounts.
 */
export function useIsTouchDevice(): boolean {
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)');

    const handleChange = () => {
      setIsTouchDevice(getIsTouchDevice());
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isTouchDevice;
}
