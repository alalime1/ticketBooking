import { API, api } from "../apis";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import type { HttpResponse } from "../types";
import { GET_ME_QUERY_KEY } from "./me";
import toast from "react-hot-toast";

export const DELETE_EVENT_MUTATION_KEY = "delete_event";

export function useDeleteEvent() {
  return useMutation({
    mutationKey: [DELETE_EVENT_MUTATION_KEY],
    mutationFn: (eventId: string) =>
      toast.promise(
        async () => {
          const response = await api
            .delete<
              HttpResponse<{ message: string }>
            >(API.events.delete(eventId))
            .json();
          return response;
        },
        {
          loading: "Deleting event...",
          success: "Event deleted",
        },
      ),
    onError: async (e) => {
      // @ts-ignore
      const data = await e.response.json();
      toast.error(data.message);
    },
  });
}
