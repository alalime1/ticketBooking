import { useNavigate } from "react-router-dom";
import { baseUrl } from "../apis";

interface Event {
  _id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  eventPasses: { name: string; price: number }[];
  banner: string;
}

interface EventCardProps {
  event: Event;
}

function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={((banner) =>
          banner.startsWith("http") ? banner : baseUrl + "/" + banner)(
          event.banner,
        )}
        alt={event.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 h-[calc(100%-192px)] flex flex-col">
        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {event.date} | {event.time}
        </p>
        <p className="text-sm text-gray-600 mb-2">{event.location}</p>
        <p className="text-lg font-bold text-blue-600 mb-4">
          From ${event.eventPasses[0].price}
        </p>
        <button
          onClick={() => navigate(`/events/${event._id}`)}
          className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors w-full"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export default EventCard;
