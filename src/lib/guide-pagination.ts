export const GUIDES_PAGE_SIZE = 24;

export function parseGuidePage(
  searchParams: Record<string, string | string[] | undefined> | URLSearchParams,
): number {
  const raw =
    searchParams instanceof URLSearchParams
      ? searchParams.get("page")
      : Array.isArray(searchParams.page)
        ? searchParams.page[0]
        : searchParams.page;
  return Math.max(1, Number(raw) || 1);
}

export function guidesPageHref(
  basePath: string,
  page: number,
  query?: string,
): string {
  const params = new URLSearchParams();
  if (query?.trim()) params.set("q", query.trim());
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `${basePath}?${search}` : basePath;
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize = GUIDES_PAGE_SIZE,
): {
  page: number;
  totalPages: number;
  slice: T[];
  total: number;
} {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    page: safePage,
    totalPages,
    slice: items.slice(start, start + pageSize),
    total: items.length,
  };
}
