export type UrlInfo =
  | {
      isBase: true;
    }
  | { isBase: false; subdomain: string };
