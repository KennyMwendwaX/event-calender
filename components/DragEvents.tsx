import useLocalStorage from "@/hooks/useLocalStorage";
import { useEffect, useState } from "react";

export interface DraggableEvent {
  id: number;
  title: string;
}

export default function DragEvents() {
  const [eventInput, setEventInput] = useState<string>("");
  const [draggableEvents, setDraggableEvents] = useState<DraggableEvent[]>([]);

  // Custom useLocalStorage hook to fetch the data
  const [localStorageData] = useLocalStorage<DraggableEvent[]>(
    "draggable-events",
    []
  );

  // Set the draggableEvents state with the data from localStorage
  useEffect(() => {
    setDraggableEvents(localStorageData);
  }, [localStorageData]);

  // Function to handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // Update the state with the new input value
    setEventInput(e.target.value);
  };

  // Function to handle form submission
  const handleEventSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (eventInput === "") return;

    const event = {
      id: new Date().getTime(),
      title: eventInput,
    };
    setDraggableEvents([...draggableEvents, event]);
    // Reset the input field

    setEventInput("");
  };
  return (
    <>
      <div
        id="draggable-element"
        className="ml-8 border-2 p-2 mt-[72px] rounded-md lg:h-1/2 bg-violet-50">
        <form className="space-y-2 mb-5" onSubmit={handleEventSubmit}>
          <input
            type="text"
            name="event"
            onChange={(e) => handleInputChange(e)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
          />
          <button
            type="submit"
            className="focus:outline-none text-white bg-violet-700 w-full hover:bg-violet-800 focus:ring-4 focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2">
            Add Event
          </button>
        </form>
        <div className="font-bold text-lg text-center">Drag Event</div>
        {draggableEvents.map((draggableEvent) => (
          <div
            className="fc-event cursor-pointer border-2 p-1 m-2 w-full rounded-md ml-auto text-center bg-white"
            title={draggableEvent.title}
            key={draggableEvent.id}>
            {draggableEvent.title}
          </div>
        ))}
      </div>
    </>
  );
}
