import { Link } from "react-router-dom";
import { categories } from "../App";
import EventCard from "../components/EventCard";
import { useGetEvents } from "../apis/get-events";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const events = useGetEvents();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Trending Events */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Trending Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.isLoading && (
            <div className="col-span-full text-center">Loading...</div>
          )}
          {events.isSuccess &&
            (events as any).data.data.events
              .slice(0, 4)
              // @ts-ignore
              .map((event) => <EventCard key={event._id} event={event} />)}
        </div>
      </section>

      {/* Browse by Category */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() =>
                navigate("/events", { state: { category: category.id } })
              }
              className="relative cursor-pointer block h-64 rounded-lg overflow-hidden group"
            >
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <h3 className="text-white text-xl font-semibold p-6">
                  {category.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
