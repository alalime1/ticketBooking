import { useQuery } from "@tanstack/react-query";
import { api, API } from "../apis";
import { useUserStore } from "../store/userStore";

export const GET_ME_QUERY_KEY = "get_me";

export function useGetMe() {
  const { setUser } = useUserStore();
  return useQuery({
    queryKey: [GET_ME_QUERY_KEY],
    queryFn: async () => {
      const response = await api.get(API.users.getMe).json();
      setUser((response as any).data);
      return response;
    },
    retry: 1,
  });
}
