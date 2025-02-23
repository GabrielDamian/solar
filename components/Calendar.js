"use client";
import axios from "axios";

import { useAuth } from "../contexts/AuthContext";
import React, { useEffect, useState } from "react";
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator,
} from "@daypilot/daypilot-lite-react";
import { useAlert } from "../contexts/AlertContext";

export default function ResourceCalendar() {
  const { showAlert } = useAlert();

  const [calendar, setCalendar] = useState();
  const [datePicker, setDatePicker] = useState();

  const [events, setEvents] = useState([]);
  const [columns, setColumns] = useState([]);

  const getCurrentDateFormatted = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const now = getCurrentDateFormatted();
  const [startDate, setStartDate] = useState(now);
  const { user } = useAuth();

  const styles = {
    wrap: {
      display: "flex",
    },
    left: {
      marginRight: "10px",
    },
    main: {
      flexGrow: "1",
    },
  };

  const colors = [
    { name: "Dark Green", id: "#228B22" },
    { name: "Green", id: "#6aa84f" },
    { name: "Yellow", id: "#f1c232" },
    { name: "Orange", id: "#e69138" },
    { name: "Crimson", id: "#DC143C" },
    { name: "Light Coral", id: "#F08080" },
    { name: "Purple", id: "#9370DB" },
    { name: "Turquoise", id: "#40E0D0" },
    { name: "Light Blue", id: "#ADD8E6" },
    { name: "Sky Blue", id: "#87CEEB" },
    { name: "Blue", id: "#3d85c6" },
  ];

  const progressValues = [
    { name: "0%", id: 0 },
    { name: "10%", id: 10 },
    { name: "20%", id: 20 },
    { name: "30%", id: 30 },
    { name: "40%", id: 40 },
    { name: "50%", id: 50 },
    { name: "60%", id: 60 },
    { name: "70%", id: 70 },
    { name: "80%", id: 80 },
    { name: "90%", id: 90 },
    { name: "100%", id: 100 },
  ];

  const editEvent = async (e) => {
    if (e.data.idUser !== user?._id) {
      showAlert("You can't edit other user's events", "error");
      return;
    }
    const form = [
      { name: "Event text", id: "text", type: "text" },
      {
        name: "Event color",
        id: "tags.color",
        type: "select",
        options: colors,
      },
      {
        name: "Progress",
        id: "tags.progress",
        type: "select",
        options: progressValues,
      },
    ];

    const modal = await DayPilot.Modal.form(form, e.data);
    if (modal.canceled) {
      return;
    }

    const updatedEvent = modal.result;

    calendar?.events.update(updatedEvent);
    saveEditEvent(e.data._id, updatedEvent);
  };

  const contextMenu = new DayPilot.Menu({
    items: [
      {
        text: "Delete",
        onClick: async (args) => {
          if (args.source.data.idUser !== user?._id) {
            showAlert("You can't delete other user's events", "error");
            return;
          }
          calendar?.events.remove(args.source);
          deleteEvent(args.source.data._id);
        },
      },
      {
        text: "-",
      },
      {
        text: "Edit...",
        onClick: async (args) => {
          await editEvent(args.source);
        },
      },
      {
        text: "Unlock...",
        onClick: async (args) => {
          
          // if (args.source.data.idUser !== user?._id) {
          //   showAlert("You can't unlock other user's events", "error");
          //   return;
          // }

          const now = new Date();

          const start = new Date(args.source.data.start);
          const end = new Date(args.source.data.end);
          console.log("start, now, end", start, now, end);
          if (start < now && now < end) {
            console.log("unlock");
            //TODO: get to esp32
            try {
              const resp = await axios.get("/api/esp");
              console.log("resp", resp);
            } catch (error) {
              console.log("error", error);
            }
          } else showAlert("cannot unlock", "warning");
        },
      },
    ],
  });

  const onBeforeHeaderRender = (args) => {
    args.header.areas = [
      {
        right: 5,
        top: "calc(50% - 10px)",
        width: 20,
        height: 20,
        action: "ContextMenu",
        symbol: "icons/daypilot.svg#threedots-v",
        style: "cursor: pointer",
        toolTip: "Show context menu",
        borderRadius: "50%",
        backColor: "#00000033",
        fontColor: "#ffffff",
        padding: 2,
        // menu: new DayPilot.Menu({
        //   onShow: async (args) => {
        //     const column = columns.find((c) => c.id === args.source.id);
        //     const items = args.menu.items || [];
        //     if (column?.blocked) {
        //       items[0].text = "Unblock";
        //     } else {
        //       items[0].text = "Block";
        //     }
        //   },
        //   items: [
        //     {
        //       text: "Block",
        //       onClick: async (args) => {
        //         const updatedColumns = columns.map((c) =>
        //           c.id === args.source.id ? { ...c, blocked: !c.blocked } : c
        //         );
        //         setColumns(updatedColumns);
        //       },
        //     },
        //     {
        //       text: "Edit",
        //       onClick: async (args) => {
        //         const column = columns.find((c) => c.id === args.source.id);
        //         if (!column) {
        //           return;
        //         }
        //         const modal = await DayPilot.Modal.prompt(
        //           "Edit column name:",
        //           column.name
        //         );
        //         if (modal.canceled) {
        //           return;
        //         }
        //         if (e.data.idUser !== user?._id) {
        //           showAlert("You can't edit this event", "error");
        //           return;
        //         }
        //         const updatedColumns = columns.map((c) =>
        //           c.id === args.source.id ? { ...c, name: modal.result } : c
        //         );
        //         setColumns(updatedColumns);
        //       },
        //     },
        //     {
        //       text: "Delete",
        //       onClick: async (args) => {
        //         const updatedColumns = columns.filter(
        //           (c) => c.id !== args.source.id
        //         );
        //         setColumns(updatedColumns);
        //       },
        //     },
        //   ],
        // }),
      },
    ];
  };

  const onBeforeCellRender = (args) => {
    const column = columns.find((c) => c.id === args.cell.resource);
    if (column?.blocked) {
      args.cell.properties.backColor = "#f0f0f0";
    }
  };

  const onBeforeEventRender = (args) => {
    console.log("args", args);
    const start = new Date(args.data.start.value);
    const end = new Date(args.data.end.value);
    const now = new Date();
    if (start < now && now < end) {
      args.data.borderColor = "red";
      args.data.text += " (unlockable)";
    } else args.data.borderColor = "darker";

    const color = (args.data.tags && args.data.tags.color) || "#3d85c6";
    args.data.backColor = color + "cc";

    const progress = args.data.tags?.progress || 0;

    args.data.html = "";

    args.data.areas = [
      {
        id: "text",
        top: 5,
        left: 5,
        right: 5,
        height: 20,
        text: args.data.text,
        fontColor: "#fff",
      },
      {
        id: "progress-text",
        bottom: 5,
        left: 5,
        right: 5,
        height: 40,
        text: progress + "%",
        borderRadius: "5px",
        fontColor: "#000",
        backColor: "#ffffff33",
        style: "text-align: center; line-height: 20px;",
      },
      {
        id: "progress-background",
        bottom: 10,
        left: 10,
        right: 10,
        height: 10,
        borderRadius: "5px",
        backColor: "#ffffff33",
        toolTip: "Progress: " + progress + "%",
      },
      {
        id: "progress-bar",
        bottom: 10,
        left: 10,
        width: `calc((100% - 20px) * ${progress / 100})`,
        height: 10,
        borderRadius: "5px",
        backColor: color,
      },
      {
        id: "menu",
        top: 5,
        right: 5,
        width: 20,
        height: 20,
        padding: 2,
        symbol: "icons/daypilot.svg#threedots-v",
        fontColor: "#fff",
        backColor: "#00000033",
        borderRadius: "50%",
        style: "cursor: pointer;",
        toolTip: "Show context menu",
        action: "ContextMenu",
      },
    ];
  };

  const onTodayClick = () => {
    datePicker?.select(DayPilot.Date.today());
  };

  const onPreviousClick = () => {
    const previous = new DayPilot.Date(startDate).addDays(-1);
    datePicker?.select(previous);
  };

  const onNextClick = () => {
    const next = new DayPilot.Date(startDate).addDays(1);
    datePicker?.select(next);
  };

  const loadData = async () => {
    try {
      if (!calendar || calendar.disposed()) {
        return;
      }

      const columnsData = await axios.get("/api/resource");

      const columns1 = columnsData.data.resources.map((r, index) => ({
        name: r.name,
        id: "R" + index, //r._id,
      }));
      setColumns(columns1);
      const eventsData = await axios.get("/api/event");
      if (eventsData.data.events) setEvents(eventsData.data.events);

      const now = getCurrentDateFormatted();
      datePicker?.select(now);
    } catch (e) {
      console.log("err", e);
    }
  };

  useEffect(() => {
    loadData();
  }, [calendar, datePicker]);

  const saveEvent = async (event) => {
    const eventData = await axios.post("/api/event", { event });
    return eventData;
  };

  const deleteEvent = async (id) => {
    const eventData = await axios.delete(`/api/event?id=${id}`);
    return eventData;
  };

  const saveEditEvent = async (id, event) => {
    const eventData = await axios.put(`/api/event?id=${id}`, { event });
    return eventData;
  };

  const onTimeRangeSelected = async (args) => {
    const column = columns.find((c) => c.id === args.resource);
    if (column?.blocked) {
      calendar?.clearSelection();
      return;
    }

    const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
    calendar?.clearSelection();
    if (modal.canceled) {
      return;
    }
    calendar?.events.add({
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
      text: modal.result,
      resource: args.resource,
      tags: {},
    });
    saveEvent({
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
      idUser: user?._id,
      text: modal.result,
      resource: args.resource,
      tags: {},
    });
  };

  const onEventMove = async (args) => {
    const column = columns.find((c) => c.id === args.newResource);
    if (column?.blocked) {
      args.preventDefault();
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.left}>
        <DayPilotNavigator
          selectMode={"Day"}
          showMonths={3}
          skipMonths={3}
          onTimeRangeSelected={(args) => setStartDate(args.start)}
          controlRef={setDatePicker}
        />
      </div>
      <div style={styles.main}>
        <div className={"toolbar"}>
          <button onClick={onPreviousClick} className={"btn-light"}>
            Previous
          </button>
          <button onClick={onTodayClick}>Today</button>
          <button onClick={onNextClick} className={"btn-light"}>
            Next
          </button>
        </div>
        <DayPilotCalendar
          viewType={"Resources"}
          columns={columns}
          startDate={startDate}
          events={events}
          eventBorderRadius={"5px"}
          headerHeight={50}
          durationBarVisible={false}
          onTimeRangeSelected={onTimeRangeSelected}
          onEventClick={async (args) => {
            await editEvent(args.e);
          }}
          contextMenu={contextMenu}
          onBeforeHeaderRender={onBeforeHeaderRender}
          onBeforeEventRender={onBeforeEventRender}
          onBeforeCellRender={onBeforeCellRender}
          onEventMove={onEventMove}
          controlRef={setCalendar}
        />
      </div>
    </div>
  );
}
