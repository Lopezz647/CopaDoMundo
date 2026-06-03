import { useEffect } from 'react';

export function useMatchPolling(
  onUpdate: (matches: any[]) => void,
  intervalMs: number = 5000
) {
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const fetchMatches = async () => {
      try {
        const res = await fetch('/api/futebol/competitions/WC/matches');
        const data = await res.json();

        if (isMounted && data.matches) {
          onUpdate(data.matches);
        }
      } catch (error) {
        console.error('Erro ao buscar matches:', error);
      }

      if (isMounted) {
        timeoutId = setTimeout(fetchMatches, intervalMs);
      }
    };

    // Primeira chamada imediata
    fetchMatches();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [onUpdate, intervalMs]);
}
