import { useQuery } from "@tanstack/react-query";
import { api, API } from "../apis";

export const GET_USERS_QUERY_KEY = "get_all_users";

export function useGetAllUsers() {
  return useQuery({
    queryKey: [GET_USERS_QUERY_KEY],
    queryFn: async () => {
      const response = await api.get(API.users.getAll + "?limit=10000").json();
      return response;
    },
  });
}
