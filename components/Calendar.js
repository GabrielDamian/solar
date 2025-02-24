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
      width: "100%",
    },
    toolbar: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
    },
    button: {
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      backgroundColor: "#007bff",
      color: "#fff",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    buttonLight: {
      backgroundColor: "#6c757d",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    legend: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "10px",
    },
    legendItem: {
      display: "flex",
      alignItems: "center",
      marginRight: "10px",
    },
    legendColor: {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      marginRight: "5px",
    },
  };

  const editEvent = async (e) => {
    if (e.data.idUser !== user?._id) {
      showAlert("You can't edit other user's reservations", "error");
      return;
    }
    const form = [{ name: "Event text", id: "text", type: "text" }];

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
            showAlert("You can't delete other user's reservations", "error");
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
          console.log("args", args);
          const idx = parseInt(args.source.data.resource.replace("R", ""));
          let targetESP =
            idx % 2 !== 0
              ? process.env.NEXT_PUBLIC_ESP1
              : process.env.NEXT_PUBLIC_ESP2;
          const target = targetESP.replace("?door=unlock", "");

          if (args.source.data.idUser !== user?._id) {
            showAlert("You can't unlock other user's reservations", "error");
            return;
          }
          const now = new Date();

          const start = new Date(args.source.data.start);
          const end = new Date(args.source.data.end);
          console.log("start, now, end", start, now, end);
          if (start < now && now < end) {
            console.log("unlock");
            //TODO: get to esp32
            try {
              const resp = await axios.get(targetESP);
              console.log("resp", resp.status);

              if (resp.status == 200) {
                showAlert("Unlock successful on " + target + "!", "success");
              } else showAlert("Unlock failed on " + target + "!", "error");
            } catch (error) {
              console.log("error1", error);

              showAlert("Unlock failed on " + target + "!", "error");
            }
          } else
            showAlert("You're outside of the reservation time!", "warning");
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
    const start = new Date(args.data.start.value);
    const end = new Date(args.data.end.value);
    const now = new Date();
    if (args.data.idUser === user?._id && start < now && now < end) {
      args.data.tags = args.data.tags || {};
      args.data.tags.color = "#006400";
      args.data.text += " (unlockable)";

      // Calculate progress
      const totalDuration = end - start;
      const elapsedDuration = now - start;
      const progress1 = Math.min((elapsedDuration / totalDuration) * 100, 100);
      args.data.tags.progress = Math.trunc(progress1);
    } else {
      args.data.borderColor = "darker";
    }
    const colorUser = args.data.idUser === user?._id ? "#3d85c6" : "#808080";
    const color = (args.data.tags && args.data.tags.color) || colorUser;
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

    const modal = await DayPilot.Modal.prompt(
      "Create a new reservation:",
      "Reservation 1"
    );
    calendar?.clearSelection();
    if (modal.canceled) {
      return;
    }
    calendar?.events.add({
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
      idUser: user?._id,
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
    if (user?._id !== args.e.data.idUser) {
      showAlert("You can't move other user's reservations", "error");
      args.preventDefault();
      return;
    }

    const column = columns.find((c) => c.id === args.newResource);
    if (column?.blocked) {
      args.preventDefault();
    }
  };

  const onEventResize = async (args) => {
    if (user?._id !== args.e.data.idUser) {
      showAlert("You can't resize other user's reservations", "error");
      args.preventDefault();
      return;
    }

    const column = columns.find((c) => c.id === args.resource);
    if (column?.blocked) {
      args.preventDefault();
      return;
    }

    const updatedEvent = {
      start: args.newStart,
      end: args.newEnd,
    };

    calendar?.events.update(updatedEvent);
    await saveEditEvent(args.e.data._id, updatedEvent);
  };

  return (
    <>
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div
            style={{ ...styles.legendColor, backgroundColor: "#3d85c6" }}
          ></div>
          <span>Your Reservations</span>
        </div>
        <div style={styles.legendItem}>
          <div
            style={{ ...styles.legendColor, backgroundColor: "#808080" }}
          ></div>
          <span>Other Reservations</span>
        </div>
        <div style={styles.legendItem}>
          <div
            style={{ ...styles.legendColor, backgroundColor: "#006400" }}
          ></div>
          <span>Unlockable</span>
        </div>
      </div>
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
            onEventResize={onEventResize}
            controlRef={setCalendar}
          />
        </div>
      </div>
    </>
  );
}
