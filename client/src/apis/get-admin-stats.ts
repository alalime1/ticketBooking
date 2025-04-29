import { useQuery } from "@tanstack/react-query";
import { api, API } from "../apis";

export const GET_ADMIN_STATS_QUERY_KEY = "get_admin_stats";

export function useGetAdminStats() {
  return useQuery({
    queryKey: [GET_ADMIN_STATS_QUERY_KEY],
    queryFn: async () => {
      const response = await api.get(API.users.adminStats).json();
      return response;
    },
  });
}
