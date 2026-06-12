import { useEffect, useLayoutEffect } from 'react';

// useLayoutEffect runs synchronously before paint — eliminates hydration flash.
// Falls back to useEffect on the server (where window doesn't exist).
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
