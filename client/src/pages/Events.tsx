import { useMemo, useState } from "react";
import EventCard from "../components/EventCard";
import dayjs from "dayjs";
import { useGetEvents } from "../apis/get-events";
import { useLocation } from "react-router-dom";

function Events() {
  const location = useLocation();

  const [category, setCategory] = useState(location.state?.category || "");
  function categoryFilter(eventCategory: string) {
    if (!category) return true;
    return eventCategory === category;
  }

  const [dateSelect, setDateSelect] = useState<string>("");
  const date = useMemo<dayjs.Dayjs | null>(() => {
    if (!dateSelect) return null;
    let d = dayjs();
    switch (dateSelect) {
      case "today":
        d = d.endOf("day");
        break;
      case "tomorrow":
        d = d.add(1, "day").endOf("day");
        break;
      case "thisWeek":
        d = d.endOf("week");
        break;
      case "thisMonth":
        d = d.endOf("month");
        break;
    }
    return d;
  }, [dateSelect]);

  function dateFilter(eventDate: string) {
    if (!date) return true;
    const eventDateObj = dayjs(eventDate, "YYYY-MM-DD");
    return eventDateObj.isBefore(date);
  }

  const [price, setPrice] = useState("");

  function priceFilter(eventPrice: number) {
    if (!price) return true;
    const [min, max] = price.split(",").map((v) => Number(v));
    if (min && max) {
      console.log(min, max);
      return eventPrice >= min && eventPrice <= max;
    } else if (min) {
      return eventPrice >= min;
    } else if (max) {
      return eventPrice <= max;
    }
  }

  const [search, setSearch] = useState("");

  function searchFilter(eventTitle: string) {
    if (!search) return true;
    return eventTitle.toLowerCase().includes(search.toLowerCase());
  }

  const eventsQuery = useGetEvents();

  function eventFilters(event: any) {
    let res =
      categoryFilter(event.category) &&
      searchFilter(event.title) &&
      priceFilter(event.eventPasses[0].price) &&
      dateFilter(event.date);
    return res;
  }

  const events = useMemo(() => {
    if (!eventsQuery.data) return [];
    const filteredEvents = (eventsQuery.data as any).data.events.filter(
      // @ts-ignore
      (event) => eventFilters(event),
    );
    return filteredEvents;
  }, [eventsQuery.data, search, price, date, category]);

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Upcoming Events
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="w-full bg-white px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-transparent focus:outline-none"
            >
              <option value={""}>All Categories</option>
              <option value={"concert"}>Concerts</option>
              <option value={"theater"}>Theater</option>
              <option value={"sports"}>Sports</option>
              <option value={"cinema"}>Movies</option>
            </select>
          </div>

          <div className="w-full bg-white px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <select
              value={dateSelect}
              onChange={(e) => setDateSelect(e.target.value)}
              className="w-full bg-transparent focus:outline-none"
            >
              <option value={""}>All Dates</option>
              <option value={"today"}>Today</option>
              <option value={"tomorrow"}>Tomorrow</option>
              <option value={"thisWeek"}>This Week</option>
              <option value={"thisMonth"}>This Month</option>
            </select>
          </div>

          <div className="w-full bg-white px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <select
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-transparent focus:outline-none"
            >
              <option value={""}>Any Price</option>
              <option value={["", "25"]}>Under $25</option>
              <option value={["25", "50"]}>$25 to $50</option>
              <option value={["50", "100"]}>$50 to $100</option>
              <option value={["100", ""]}>$100+</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {eventsQuery.isSuccess &&
          // @ts-ignore
          events.map((event) => <EventCard key={event._id} event={event} />)}
      </div>
    </main>
  );
}

export default Events;
