import { useEffect } from 'react';
import { PollingManager } from '../services/api/polling';

export const usePolling = (onUpdate: () => void, enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    const pollingManager = PollingManager.getInstance();
    pollingManager.startPolling(onUpdate);

    return () => {
      pollingManager.stopPolling();
    };
  }, [onUpdate, enabled]);
};