import { API, api } from "../apis";
import { useMutation } from "@tanstack/react-query";
import type { HttpResponse } from "../types";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { EventFormData } from "../pages/CreateEvent";

export const CREATE_UPDATE_EVENT_MUTATION_KEY = "create_update_event";

export function useCreateUpdateEvent() {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: [CREATE_UPDATE_EVENT_MUTATION_KEY],
    mutationFn: ({
      data,
      mode,
    }: {
      data: EventFormData;
      mode: "create" | "update";
    }) =>
      toast.promise(
        async () => {
          const formData = new FormData();
          Object.entries(data).forEach(([key, value]) => {
            if (key === "eventPasses") {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value);
            }
          });
          const response = await api[mode === "create" ? "post" : "put"]<
            HttpResponse<{}>
          >(
            mode === "create" ? API.events.create : API.events.update(data._id),
            { body: formData },
          ).json();
          return response;
        },
        {
          loading:
            mode === "create" ? "Creating Event..." : "Updating Event...",
          success: mode === "create" ? "Event Created" : "Event Updated",
        },
      ),
    onSuccess: () => {
      navigate("/admin/events");
    },
    onError: async (e) => {
      // @ts-ignore
      const data = await e.response.json();
      toast.error(data.message);
    },
  });
}
