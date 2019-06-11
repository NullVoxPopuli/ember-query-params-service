import * as qs from 'qs';

export function urlFromCache(routePath: string, dynamicSegmentValues: string[], cache: QueryParamsByPath) {
  const { protocol, host, pathname, search, hash } = window.location;
  const queryParams = cache[routePath];
  const existing = qs.parse(search.split('?')[1]);
  const query = qs.stringify({ ...existing, ...queryParams });
  const newUrl = `${protocol}//${host}${pathname}${hash}?${query}`;


  return newUrl;
}
