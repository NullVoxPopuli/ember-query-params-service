interface QueryParams {
  [key: string]: number | string | undefined | QueryParams;
}

interface QueryParamsByPath {
  [key: string]: QueryParams;
}
