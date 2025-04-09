export interface iApiResponse<TResponse> {
  response: TResponse[];
  resultCount: number;
  rowsCount: number;
}
