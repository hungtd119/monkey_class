import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const usePreviousRoute = () => {
  const router = useRouter();

  useEffect(() => {
    const handleBeforeHistoryChange = (url: string) => {
      localStorage.setItem('previousUrl', router.asPath);
    };

    router.events.on('beforeHistoryChange', handleBeforeHistoryChange);

    return () => {
      router.events.off('beforeHistoryChange', handleBeforeHistoryChange);
    };
  }, []);

};
