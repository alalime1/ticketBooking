import { useQuery } from "@tanstack/react-query";
import { api, API } from "../apis";

export const GET_BOOKING_QUERY_KEY = "get_booking";

export function useGetBooking(id: string | undefined) {
  return useQuery({
    queryKey: [GET_BOOKING_QUERY_KEY],
    queryFn: async () => {
      const response = await api.get(API.bookings.getOne(id as string)).json();
      return response;
    },
    enabled: !!id,
  });
}
