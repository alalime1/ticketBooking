import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Image,
  Pencil,
  X,
} from "lucide-react";
import { categories } from "../App";
import { useCreateUpdateEvent } from "../apis/create-update-event";
import { useParams } from "react-router-dom";
import { useGetEvent } from "../apis/get-event";
import { baseUrl } from "../apis";

export interface EventFormData {
  _id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  price: string;
  category: string;
  banner: File | null;
  description: string;
  eventPasses: { _id: string; name: string; price: number }[];
}

function CreateEvent(props: { editMode?: boolean }) {
  const navigate = useNavigate();
  const params = useParams();

  if (props.editMode && !params.id) {
    alert("No event id provided");
    navigate("/admin/events");
  }

  const getEvent = useGetEvent(useMemo(() => params.id, [params]));

  const createEvent = useCreateUpdateEvent();
  const [formData, setFormData] = useState<EventFormData>({
    _id: "",
    title: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    price: "",
    category: "",
    banner: null,
    description: "",
    eventPasses: [],
  });

  useEffect(() => {
    if (
      props.editMode &&
      getEvent.data &&
      formData._id !== (getEvent.data as any).data._id
    ) {
      setFormData((getEvent.data as any).data);
    }
  }, [getEvent.data]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      banner: file,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.eventPasses.length) {
      alert("Please add at least one event pass");
      return;
    }
    createEvent.mutate({
      data: formData,
      mode: props.editMode ? "update" : "create",
    });
  };

  const addEmptyEventPass = () => {
    setFormData((prev) => ({
      ...prev,
      eventPasses: [...prev.eventPasses, { _id: "", name: "", price: 0 }],
    }));
  };

  const onEventPassChange = (
    index: number,
    field: "name" | "price",
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      eventPasses: prev.eventPasses.map((pass, i) =>
        i === index ? { ...pass, [field]: value } : pass,
      ),
    }));
  };

  const removeEventPass = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      eventPasses: prev.eventPasses.filter((_, i) => i !== index),
    }));
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {props.editMode ? "Update" : "Create New"} Event
        </h1>
        <p className="mt-2 text-gray-600">
          {props.editMode ? "Update" : "Fill in"} the details below to{" "}
          {props.editMode ? "update the event" : "create a new event"}.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    name="date"
                    placeholder="yyyy-mm-dd"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <div className="relative">
                  <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <div className="relative">
                  <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="category"
              >
                Category
              </label>
              <div className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full focus:outline-none"
                  id="category"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <p className="block text-base font-medium text-gray-700 mb-2">
                  Event Passes
                </p>

                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  type="button"
                  onClick={addEmptyEventPass}
                >
                  + ADD
                </button>
              </div>

              {formData.eventPasses.map((pass, i) => (
                <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 mb-2">
                  <div className="self-end font-bold pb-3">{i + 1}-</div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <div className="relative">
                      <Pencil className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="name"
                        value={formData.eventPasses[i].name}
                        onChange={(e) =>
                          onEventPassChange(i, "name", e.target.value)
                        }
                        className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <div className="relative">
                      <DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        name="price"
                        value={formData.eventPasses[i].price}
                        onChange={(e) =>
                          onEventPassChange(i, "price", e.target.value)
                        }
                        min="0"
                        step="0.01"
                        className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="self-end">
                    <button
                      className="px-1 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      type="button"
                      onClick={() => removeEventPass(i)}
                    >
                      <X />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Banner Image
              </label>
              {typeof formData.banner === "string" && (
                <img
                  src={((banner) =>
                    banner.startsWith("http")
                      ? banner
                      : baseUrl + "/" + banner)(formData.banner as string)}
                  alt="Event Banner"
                  className="w-full h-auto rounded-lg mb-3"
                />
              )}
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <Image className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="banner-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="banner-upload"
                        name="banner"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileChange}
                        required={!props.editMode}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                  {formData.banner && (
                    <p className="text-sm text-gray-600">
                      Selected: {formData.banner.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/admin/events")}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {props.editMode ? "Update" : "Create"} Event
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateEvent;
