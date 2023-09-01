"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  Draggable,
  DropArg,
} from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { EventSourceInput } from "@fullcalendar/core/index.js";
import { useEffect, useState } from "react";
import AddEventModal from "@/components/AddEventModal";
import DeleteEventModal from "@/components/DeleteEventModal";

export interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: number;
}

export default function Tester() {
  const [draggableEvents, setDragableEvents] = useState([
    { title: "event 1", id: 1 },
    { title: "event 2", id: 2 },
    { title: "event 3", id: 3 },
    { title: "event 4", id: 4 },
    { title: "event 5", id: 5 },
  ]);

  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    start: "",
    allDay: false,
    id: 0,
  });

  useEffect(() => {
    let draggableElement = document.getElementById("draggable-element");
    if (draggableElement) {
      new Draggable(draggableElement, {
        itemSelector: ".fc-event", // event className selector
        eventData: function (eventElement) {
          let title = eventElement.getAttribute("title");
          let id = eventElement.getAttribute("data");
          let start = eventElement.getAttribute("start");
          return { title, id, start };
        },
      });
    }
  }, []);

  function handleDateClick(arg: { date: Date; allDay: boolean }) {
    setNewEvent({
      ...newEvent,
      start: arg.date,
      allDay: arg.allDay,
      id: new Date().getTime(),
    });
    setShowModal(true);
  }

  function addEvent(data: DropArg) {
    const event = {
      ...newEvent,
      start: data.date.toISOString(),
      title: data.draggedEl.innerText,
      allDay: data.allDay,
      id: new Date().getTime(),
    };
    setAllEvents([...allEvents, event]);
  }

  function handleDeleteModal(data: { event: { id: string } }) {
    setShowDeleteModal(true);
    setIdToDelete(Number(data.event.id));
  }

  const handleDelete = () => {
    setAllEvents(
      allEvents.filter((event) => Number(event.id) !== Number(idToDelete))
    );
    setShowDeleteModal(false);
    setIdToDelete(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewEvent({
      title: "",
      start: "",
      allDay: false,
      id: 0,
    });
    setShowDeleteModal(false);
    setIdToDelete(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewEvent({
      ...newEvent,
      title: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAllEvents([...allEvents, newEvent]);
    setShowModal(false);
    setNewEvent({
      title: "",
      start: "",
      allDay: false,
      id: 0,
    });
  };

  return (
    <>
      <nav className="flex justify-between mb-12 border-b border-violet-300 p-4">
        <div className="font-bold text-2xl text-violet-600">EventSync</div>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-between px-24">
        <div className="grid grid-cols-10">
          <div className="col-span-8">
            <FullCalendar
              plugins={[
                dayGridPlugin,
                interactionPlugin,
                timeGridPlugin,
                listPlugin,
              ]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listDay",
              }}
              events={allEvents as EventSourceInput}
              nowIndicator={true}
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              dateClick={handleDateClick}
              drop={(data) => addEvent(data)}
              eventClick={(data) => handleDeleteModal(data)}
            />
          </div>

          <div
            id="draggable-element"
            className="ml-8 w-full border-2 p-2 rounded-md mt-16 lg:h-1/2 bg-violet-50">
            <form>
              <input type="text" name="event" className="" />
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
        </div>
        <AddEventModal
          showModal={showModal}
          setShowModal={setShowModal}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleCloseModal={handleCloseModal}
          newEvent={newEvent}
        />
        <DeleteEventModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          handleDelete={handleDelete}
          handleCloseModal={handleCloseModal}
        />
      </main>
    </>
  );
}
