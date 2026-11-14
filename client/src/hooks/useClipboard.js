import { useState, useCallback } from 'react';

export function useClipboard(resetDelay = 2000) {
  const [copiedId, setCopiedId] = useState(null);

  const copy = useCallback(
    async (text, id) => {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), resetDelay);
    },
    [resetDelay]
  );

  return { copiedId, copy };
}