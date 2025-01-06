export interface FilterDto{
    userId: number;
    accountId: number | null;
    categoryId: number | null;
    type: string | null;
    start: string | null;
    end: string | null;
    sortField: string;
    sortDirection: string;
}