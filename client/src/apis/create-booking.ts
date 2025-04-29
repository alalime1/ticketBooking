import { API, api } from "../apis";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { HttpResponse } from "../types";
import toast from "react-hot-toast";

export const CREATE_BOOKING_MUTATION_KEY = "create_booking";

export function useCreateBooking() {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: [CREATE_BOOKING_MUTATION_KEY],
    mutationFn: (params: {
      eventId: string;
      numberOfTickets: number;
      passName: string;
      totalPrice: number;
    }) =>
      toast.promise(
        async () => {
          const response = await api
            .post<
              HttpResponse<{ _id: string }>
            >(API.bookings.create, { json: params })
            .json();
          return response;
        },
        {
          loading: "Booking...",
          success: "Booked Successfully",
        },
      ),
    onSuccess: (response) => {
      navigate(`/booking-confirmation/${response.data._id}`);
    },
    onError: async (e) => {
      // @ts-ignore
      const data = await e.response.json();
      toast.error(data.message);
    },
  });
}
