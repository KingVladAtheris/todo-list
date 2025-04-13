import newSession from "./sessions.js";
import "./style.css";
import loadCalendar from "./calendar.js";
document.addEventListener("DOMContentLoaded", () => {
    newSession();
    loadCalendar();
});