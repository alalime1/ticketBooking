import { API, api } from "../apis";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import type { HttpResponse } from "../types";
import { GET_ME_QUERY_KEY } from "./me";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const SIGNUP_MUTATION_KEY = "user_signup";

export function useSignup() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationKey: [SIGNUP_MUTATION_KEY],
    mutationFn: (params: { name: string; email: string; password: string }) =>
      toast.promise(
        async () => {
          const response = await api
            .post<
              HttpResponse<{ token: string }>
            >(API.users.register, { json: params })
            .json();
          return response;
        },
        {
          loading: "Signing up...",
          success: "Signed Up",
        },
      ),
    onSuccess: (response) => {
      localStorage.setItem("token", response.data.token);
      queryClient.invalidateQueries({ queryKey: [GET_ME_QUERY_KEY] });
      navigate("/");
    },

    onError: async (e) => {
      // @ts-ignore
      const data = await e.response.json();
      toast.error(data.message);
    },
  });
}
