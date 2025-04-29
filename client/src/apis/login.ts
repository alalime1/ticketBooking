import { API, api } from "../apis";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import type { HttpResponse } from "../types";
import { GET_ME_QUERY_KEY } from "./me";
import toast from "react-hot-toast";

export const LOGIN_MUTATION_KEY = "user_login";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [LOGIN_MUTATION_KEY],
    mutationFn: (params: { email: string; password: string }) =>
      toast.promise(
        async () => {
          const response = await api
            .post<
              HttpResponse<{ token: string }>
            >(API.users.login, { json: params })
            .json();
          return response;
        },
        {
          loading: "Logging in...",
          success: "Logged In",
        },
      ),
    onSuccess: (response) => {
      localStorage.setItem("token", response.data.token);
      queryClient.invalidateQueries({ queryKey: [GET_ME_QUERY_KEY] });
    },
    onError: async (e) => {
      // @ts-ignore
      const data = await e.response.json();
      toast.error(data.message);
    },
  });
}
