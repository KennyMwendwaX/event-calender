import useLocalStorage from "@/hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export interface DraggableEvent {
  id: number;
  title: string;
}

export default function DragEvents() {
  const [draggableEvents, setDraggableEvents] = useState<DraggableEvent[]>([]);

  const { register, handleSubmit, reset } = useForm<DraggableEvent>();

  async function onSubmit(values: DraggableEvent) {
    const event = {
      id: new Date().getTime(),
      title: values.title,
    };
    setDraggableEvents([...draggableEvents, event]);

    // Reset the input field
    reset();
  }

  return (
    <>
      <div
        id="draggable-element"
        className="ml-8 border-2 p-2 mt-[72px] rounded-md lg:h-1/2 bg-violet-50">
        <form className="space-y-2 mb-5" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            id="title"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
            {...register("title")}
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
