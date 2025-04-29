import { useQuery } from "@tanstack/react-query";
import { api, API } from "../apis";

export const GET_ALL_BOOKINGS_QUERY_KEY = "get_all_bookings";

export function useGetAllBookings() {
  return useQuery({
    queryKey: [GET_ALL_BOOKINGS_QUERY_KEY],
    queryFn: async () => {
      const response = await api.get(API.bookings.getAll).json();
      return response;
    },
  });
}
