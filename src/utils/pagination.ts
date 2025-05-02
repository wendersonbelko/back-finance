export interface PaginationType {
  page: number | string
  limit: number | string
}

export function pagination({ page, limit }: PaginationType) {
  const currentPage = Number(page) > 0 ? Number(page) : 1
  const pageSize = Number(limit) > 0 ? Number(limit) : 10
  return {
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  }
}