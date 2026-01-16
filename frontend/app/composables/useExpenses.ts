import type { Expense, ExpenseInput } from "../types/expense";
import { useApi } from "./useApi";
export function useExpenses() {
  const { request } = useApi();

  const list = (params: {
    page?: number;
    limit?: number;
    category?: string;
    query?: string;
  }) => {
    const qs = new URLSearchParams();
    if (params.page) qs.set("page", String(params.page));
    if (params.limit) qs.set("limit", String(params.limit));
    if (params.category) qs.set("category", params.category);
    if (params.query) qs.set("query", params.query);

    return request<{ data: Expense[]; totalPages: number }>(
      `/expenses?${qs.toString()}`
    );
  };

  const getById = (id: number) => request<Expense>(`/expenses/${id}`);

  const create = (payload: ExpenseInput) =>
    request<Expense>(`/expenses`, {
      method: "POST",
      body: payload,
    });

  const update = (id: number, payload: ExpenseInput) =>
    request<Expense>(`/expenses/${id}`, {
      method: "PUT",
      body: payload,
    });

  const remove = (id: number) =>
    request<void>(`/expenses/${id}`, {
      method: "DELETE",
    });

  const reportByCategory = (params: { from: string; to: string; category?: string }) => {
    const qs = new URLSearchParams();
    qs.set("from", params.from);
    qs.set("to", params.to);
    if (params.category) qs.set("category", params.category);

    return request<{ category: string; total: number }[]>(
      `/reports/expenses/by-category?${qs.toString()}`
    );
  };

  const reportByPeriod = (params: {
    from: string;
    to: string;
    group: "day" | "month";
    category?: string;
  }) => {
    const qs = new URLSearchParams();
    qs.set("from", params.from);
    qs.set("to", params.to);
    qs.set("group", params.group);
    if (params.category) qs.set("category", params.category);

    return request<{ period: string; total: number }[]>(
      `/reports/expenses/by-period?${qs.toString()}`
    );
  };

  return { list, getById, create, update, remove, reportByCategory, reportByPeriod };
}
