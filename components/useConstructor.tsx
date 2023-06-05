import { useRef } from 'react';

export const useConstructor = (cb = () => {}) => {
  const hasBeenCalled = useRef(false)
  if (hasBeenCalled.current) return
  cb()
  hasBeenCalled.current = true
}
