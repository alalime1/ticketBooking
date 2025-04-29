import { useQuery } from "@tanstack/react-query";
import { api, API } from "../apis";

export const GET_EVENTS_QUERY_KEY = "get_events";

export function useGetEvents() {
  return useQuery({
    queryKey: [GET_EVENTS_QUERY_KEY],
    queryFn: async () => {
      const response = await api.get(API.events.getAll + "?limit=10000").json();
      return response;
    },
  });
}
