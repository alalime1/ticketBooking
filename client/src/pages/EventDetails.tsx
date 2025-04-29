import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetEvent } from "../apis/get-event";
import { baseUrl } from "../apis";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState(1);
  const [selectedSection, setSelectedSection] = useState("");

  const getEvent = useGetEvent(useMemo(() => id, [id]));

  useEffect(() => {
    if (getEvent.isSuccess && getEvent.data && !selectedSection) {
      setSelectedSection((getEvent.data as any).data.eventPasses[0].name);
    }
  }, [getEvent.data]);

  if (getEvent.isError) {
    return <div className="text-center py-12">Event not found</div>;
  }

  if (getEvent.isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Event Image and Details */}
        <div>
          <img
            src={((banner) =>
              banner.startsWith("http") ? banner : baseUrl + "/" + banner)(
              (getEvent.data as any).data.banner,
            )}
            alt={(getEvent.data as any).data.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg mb-6"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {(getEvent.data as any).data.title}
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="flex items-center text-gray-600">
              <span className="font-semibold w-24">Date:</span>
              <span>{(getEvent.data as any).data.date}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="font-semibold w-24">Time:</span>
              <span>7:30 PM</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="font-semibold w-24">Location:</span>
              <span>{(getEvent.data as any).data.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="font-semibold w-24">Duration:</span>
              <span>{(getEvent.data as any).data.duration}</span>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Book Your Tickets
            </h2>

            <div className="space-y-6">
              {/* Number of Tickets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Tickets:
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setTickets(Math.max(1, tickets - 1))}
                    className="px-3 py-2 border rounded-md hover:bg-gray-50"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={tickets}
                    onChange={(e) =>
                      setTickets(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-20 text-center border-gray-300 rounded-md"
                  />
                  <button
                    onClick={() => setTickets(tickets + 1)}
                    className="px-3 py-2 border rounded-md hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Seating Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seating Section:
                </label>
                <div className="space-y-2">
                  {/* @ts-ignore */}
                  {(getEvent.data as any).data.eventPasses.map((pass) => (
                    <label
                      key={pass._id}
                      className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="pass"
                        value={pass.name}
                        checked={selectedSection === pass.name}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="flex-1">{pass.name}</span>
                      <span className="font-semibold">${pass.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Total and Book Button */}
              <div className="pt-4 border-t">
                <div className="flex justify-between text-lg font-bold mb-4">
                  <span>Total:</span>
                  <span>
                    $
                    {tickets *
                      (getEvent.data as any).data.eventPasses.find(
                        // @ts-ignore
                        (s) => s.name === selectedSection,
                      )?.price}
                  </span>
                </div>
                <button
                  onClick={() =>
                    navigate("/booking-summary", {
                      state: {
                        eventId: (getEvent.data as any).data._id,
                        numberOfTickets: tickets,
                        passName: (getEvent.data as any).data.eventPasses.find(
                          // @ts-ignore
                          (s) => s.name === selectedSection,
                        )?.name,
                        totalPrice:
                          tickets *
                          (getEvent.data as any).data.eventPasses.find(
                            // @ts-ignore
                            (s) => s.name === selectedSection,
                          )?.price,
                      },
                    })
                  }
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Continue to Booking Summary
                </button>
              </div>
            </div>
          </div>

          {/* About the Event */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About the Event
            </h2>
            <p className="text-gray-600">
              {(getEvent.data as any).data.description}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default EventDetails;
