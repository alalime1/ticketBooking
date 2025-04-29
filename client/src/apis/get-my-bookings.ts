import { useQuery } from "@tanstack/react-query";
import { api, API } from "../apis";

export const GET_MY_BOOKINGS_QUERY_KEY = "get_my_bookings";

export function useGetMyBookings() {
  return useQuery({
    queryKey: [GET_MY_BOOKINGS_QUERY_KEY],
    queryFn: async () => {
      const response = await api.get(API.bookings.myBookings).json();
      return response;
    },
  });
}
