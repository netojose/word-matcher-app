import axios from "axios";

type Config = {
  method?: "post" | "patch" | "delete" | "put";
};

export function mutationFn<T>(url: string, { method = "post" }: Config = {}) {
  return async (data: Record<string, unknown>): Promise<T> => {
    const response = await axios<T>({
      method,
      url,
      baseURL: import.meta.env.VITE_API_URL,
      data,
    });

    return response.data;
  };
}

export function queryFn<T>(url: string) {
  return async (): Promise<T> => {
    const response = await axios<T>({
      url,
      baseURL: import.meta.env.VITE_API_URL,
    });
    return response.data;
  };
}
