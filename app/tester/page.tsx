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
import DragEvents from "@/components/DragEvents";
import useLocalStorage from "@/hooks/useLocalStorage";

export interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: number;
}

export default function Tester() {
  // Custom useLocalStorage hook to fetch the data
  const [localStorageData, setLocaStorageData] = useLocalStorage<Event[]>(
    "events",
    []
  );

  // Set the draggableEvents state with the data from localStorage
  useEffect(() => {
    setAllEvents(localStorageData);
  }, [localStorageData]);

  const [allEvents, setAllEvents] = useState<Event[]>(localStorageData);
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

      <div className="flex items-start px-24">
        <div className="w-5/6">
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

        <DragEvents />
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
    </>
  );
}
