import ky from "ky";

export const baseUrl = import.meta.env.VITE_API_URL;

export const API = {
  users: {
    register: "users/register",
    login: "users/login",
    getMe: "users/me",
    getAll: "users/all",
    adminStats: "users/admin-stats",
  },
  events: {
    getAll: "events",
    create: "events",
    getOne: (id: string) => `events/${id}`,
    update: (id: string) => `events/${id}`,
    delete: (id: string) => `events/${id}`,
  },
  bookings: {
    create: "bookings",
    myBookings: "bookings/my-bookings",
    getOne: (id: string) => `bookings/${id}`,
    getAll: "bookings",
  },
};

export const api = ky.create({
  prefixUrl: baseUrl + "/api/",
  hooks: {
    beforeRequest: [
      (options) => {
        const token = localStorage.getItem("token");
        if (token) {
          options.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
  },
});
