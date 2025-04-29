import { useQuery } from "@tanstack/react-query";
import { api, API } from "../apis";

export const GET_EVENT_QUERY_KEY = "get_event";

export function useGetEvent(id: string | undefined) {
  return useQuery({
    queryKey: [GET_EVENT_QUERY_KEY],
    queryFn: async () => {
      const response = await api.get(API.events.getOne(id as string)).json();
      return response;
    },
    enabled: !!id,
  });
}
