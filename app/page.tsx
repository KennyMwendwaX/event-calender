"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  Draggable,
  DropArg,
} from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useState } from "react";

interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: number;
}

export default function Home() {
  const [events, setEvents] = useState([
    { title: "event 1", id: 1 },
    { title: "event 2", id: 2 },
    { title: "event 3", id: 3 },
    { title: "event 4", id: 4 },
    { title: "event 5", id: 5 },
  ]);
  return (
    <>
      <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
        <div className="font-bold text-2xl text-gray-700">EventSync</div>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="grid grid-cols-10">
          <div className="col-span-8">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "resourceTimelineWeek, dayGridMonth,timeGridWeek",
              }}
              events={{}}
              nowIndicator={true}
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              // dateClick={{}}
              // drop={{}}
              // eventClick={{}}
            />
          </div>

          <div
            id="draggable-element"
            className="ml-8 w-full border-2 p-2 rounded-md mt-16 lg:h-1/2 bg-violet-50">
            <div className="font-bold text-lg text-center">Drag Event</div>
            {events.map((event) => (
              <div
                className="fc-event border-2 p-1 m-2 w-full rounded-md ml-auto text-center bg-white"
                title={event.title}
                key={event.id}>
                {event.title}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
