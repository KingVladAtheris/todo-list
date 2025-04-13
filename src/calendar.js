import { expandSession } from "./sessions.js";  

// Populate the calendar with dates from localStorage
function loadCalendar() {
    const calendarContainer = document.getElementById("calendar");
    const dateMap = createDateMap();  // Create the date map from session data

    const currentMonth = new Date().getMonth();  // Current month
    const currentYear = new Date().getFullYear();  // Current year

    // Create calendar for the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // Day of the week for the 1st day of the month

    let dayCounter = 1;

    // Render the calendar header (for days of the week)
    const header = document.createElement("div");
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(day => {
        const dayNameDiv = document.createElement("div");
        dayNameDiv.textContent = day;
        header.appendChild(dayNameDiv);
    });
    calendarContainer.appendChild(header);

    // Render the calendar days
    for (let i = 0; i < 6; i++) {  
        const row = document.createElement("div");
        row.classList.add("calendar-row");

        for (let j = 0; j < 7; j++) {
            const dayDiv = document.createElement("div");

            // Check if this is a valid day to display 
            if (i === 0 && j < firstDayOfMonth) {
                row.appendChild(dayDiv);  // Empty div for spaces before the first day of the month
            } else if (dayCounter <= daysInMonth) {
                const currentDayString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-${dayCounter.toString().padStart(2, "0")}`;
                dayDiv.textContent = dayCounter;

                // If this day exists in dateMap, highlight it
                if (dateMap[currentDayString]) {
                    dayDiv.classList.add("highlighted");

                    // Create a div for the session name and append it next to the date number
                    const sessionNameDiv = document.createElement("span");  
                    sessionNameDiv.classList.add("session-name");
                    sessionNameDiv.textContent = dateMap[currentDayString];  // Get session name from the map
                    dayDiv.appendChild(sessionNameDiv);

                    // On click, expand the session corresponding to this day
                    dayDiv.addEventListener("click", () => {
                        const sessionName = dateMap[currentDayString];
                        expandSession(sessionName);  // Pass the session name corresponding to this date
                    });
                }

                dayCounter++;
                row.appendChild(dayDiv);
            }
        }

        calendarContainer.appendChild(row);
    }
}

// Create a map of workout dates to session names from sessions in localStorage
function createDateMap() {
    const sessions = JSON.parse(localStorage.getItem("sessions")) || [];
    const dateMap = {};

    // Iterate over sessions to collect workout dates and corresponding session names
    sessions.forEach(session => {
        session.dates.forEach(date => {
            // Convert full ISO string to 'YYYY-MM-DD' format
            const dateString = new Date(date).toISOString().split("T")[0];  // Convert date to 'YYYY-MM-DD'
            dateMap[dateString] = session.name;  // Map the date to the session name
        });
    });

    return dateMap;
}

export default loadCalendar;
