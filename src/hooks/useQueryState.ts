import { useCallback } from 'react';
import { useRouter } from 'next/router';
import qs from 'qs';

export const useQueryState = (query: any) => {
  const router = useRouter();

  const setQuery = useCallback(
    (value: any) => {
      const existingQueries = router.query;
      const newQuery = { ...existingQueries, [query]: value };

      const searchParams = new URLSearchParams(newQuery);

      router.push({ pathname: router.pathname, query: searchParams.toString() });
    },
    [router, query]
  );

  return [router.query[query], setQuery];
};
