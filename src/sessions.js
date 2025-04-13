import programSetup from "./program.js";

function newSession() {
    const addSession = document.getElementById("addSession");

    // Load the existing sessions from localStorage and display them
    let sessions = JSON.parse(localStorage.getItem("sessions")) || [];
    const body = document.getElementById("sessions");

    // Sort sessions by the countdown (from lowest to highest)
    sessions.sort((a, b) => {
        const aCountdown = getNextSessionDate(a.dates);
        const bCountdown = getNextSessionDate(b.dates);

        const aTimeLeft = aCountdown ? aCountdown - new Date() : Infinity;
        const bTimeLeft = bCountdown ? bCountdown - new Date() : Infinity;

        return aTimeLeft - bTimeLeft;
    });
    // Display the saved sessions
    sessions.forEach(session => {
        const workoutDiv = document.createElement("div");
        workoutDiv.classList.add("session");
        workoutDiv.textContent = session.name;  // Display session name
        
        // Calculate the countdown for the session
        if (session.dates && session.dates.length > 0) {
            const nextDate = getNextSessionDate(session.dates);
            const countdown = getCountdown(nextDate);

            const countdownDiv = document.createElement("div");
            countdownDiv.textContent = `Next workout: ${countdown}`;
            workoutDiv.appendChild(countdownDiv);
        }

        workoutDiv.addEventListener("click", () => {
            expandSession(session.name);  // Pass session name to expand
        });
        body.appendChild(workoutDiv);

    });
    

    addSession.addEventListener("click", () => {
        addSession.disabled = true;

        const title = document.createElement("input");
        title.type = "text";
        title.placeholder = "Workout Name";

        const approve = document.createElement("button");
        approve.textContent = "Ok";

        body.appendChild(title);
        body.appendChild(approve);

        approve.addEventListener("click", () => {
            const inputValue = title.value;

            // Create a new session object with name and empty dates array
            const newSession = {
                name: inputValue,
                dates: []  // Initialize an empty dates array
            };

            // Add the new session to the sessions array in localStorage
            sessions.push(newSession);
            localStorage.setItem("sessions", JSON.stringify(sessions));

            // Create session div and attach the value
            const workoutDiv = document.createElement("div");
            workoutDiv.textContent = inputValue;

            // Pass inputValue directly to expandSession
            workoutDiv.addEventListener("click", () => {
                expandSession(inputValue); // Pass it cleanly
            });

            body.appendChild(workoutDiv);

            // Call the storeWorkoutDate function here and pass the new session
            const dateContainer = storeWorkoutDate(inputValue);  // Pass session name (inputValue) to associate dates
            body.appendChild(dateContainer);  // Append it to the body

            // Cleanup
            title.remove();
            approve.remove();
            addSession.disabled = false;
            
        });
    });
}

// Helper function to calculate the next session date
function getNextSessionDate(dates) {
    const today = new Date();
    const upcomingDates = dates.map(date => new Date(date))
        .filter(date => date >= today);  // Filter out past dates
    upcomingDates.sort((a, b) => a - b);  // Sort the remaining dates to get the earliest upcoming one
    return upcomingDates[0];  // Return the earliest upcoming date
}

// Helper function to calculate the countdown from today's date
function getCountdown(nextDate) {
    const now = new Date();
    const timeDiff = nextDate - now;

    if (timeDiff <= 0) {
        return "Already past";
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
        return `In ${days} day(s)`;
    } else {
        return `In ${hours} hour(s)`;
    }
}




function expandSession(workoutName) {
    const programBox = document.getElementById("program");
    const sessionsHide = document.getElementById("overbox");
    const programHide = document.getElementById("programOverLayer");

    sessionsHide.classList.add("hidden");
    programHide.classList.remove("hidden");

    // Clear previous content if needed
    programBox.innerHTML = "";

    const programTitle = document.createElement("div");
    programTitle.textContent = `${workoutName}`;

    // Create a delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Session";
    deleteButton.style.marginRight = "10px";

    deleteButton.addEventListener("click", () => {
        let sessions = JSON.parse(localStorage.getItem("sessions")) || [];
        let workouts = JSON.parse(localStorage.getItem("workouts")) || [];

        // Remove the session and related workouts
        sessions = sessions.filter(session => session.name !== workoutName);
        workouts = workouts.filter(workout => workout.sessionName !== workoutName); // ← FIX this line

        localStorage.setItem("sessions", JSON.stringify(sessions));
        localStorage.setItem("workouts", JSON.stringify(workouts));

        // Remove the session div from the DOM
        const sessionDivs = document.querySelectorAll("#sessions div");
        sessionDivs.forEach(div => {
            if (div.textContent.includes(workoutName)) {
                div.remove();
                location.reload();
            }
        });

        programBox.innerHTML = ""; // Clear UI
        sessionsHide.classList.remove("hidden");
        

    });

    // Create Return Button
    const returnButton = document.createElement("button");
    returnButton.textContent = "Return to Sessions";
    returnButton.style.marginRight = "10px";
    returnButton.addEventListener("click", () => {
        sessionsHide.classList.remove("hidden");
        programHide.classList.add("hidden");

    })

    // Append BEFORE calling programSetup (so it's not wiped)
    programBox.appendChild(programTitle);
    programBox.appendChild(deleteButton);
    programBox.appendChild(returnButton);

    // Set up workout options for this session
    programSetup(workoutName);
    
}




// Store the date for the session

function storeWorkoutDate(sessionId) {
    // Create a container to hold the date input and buttons
    const dateContainer = document.createElement("div");

    // Create a select option for single date or recurring date
    const optionSelect = document.createElement("select");
    const singleDateOption = document.createElement("option");
    singleDateOption.value = "single";
    singleDateOption.textContent = "Single Date";
    const recurringDateOption = document.createElement("option");
    recurringDateOption.value = "recurring";
    recurringDateOption.textContent = "Recurring Workout (Day of the Week)";
    
    optionSelect.appendChild(singleDateOption);
    optionSelect.appendChild(recurringDateOption);

    // Create the date input for a single date workout
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.style.display = "inline";  // Hidden by default

    // Create the day of the week select input for recurring workouts
    const daySelect = document.createElement("select");
    daySelect.style.display = "none";  // Hidden by default
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    daysOfWeek.forEach(day => {
        const option = document.createElement("option");
        option.value = day;
        option.textContent = day;
        daySelect.appendChild(option);
    });

    // Create a time input
    const timeInput = document.createElement("input");
    timeInput.type = "time";
    timeInput.style.display = "inline";  // Show by default with single date
    dateContainer.appendChild(timeInput);

    // Add everything to the container
    dateContainer.appendChild(optionSelect);
    dateContainer.appendChild(dateInput);
    dateContainer.appendChild(daySelect);

    // Add event listener to the option select to show appropriate input
    optionSelect.addEventListener("change", () => {
        if (optionSelect.value === "single") {
            dateInput.style.display = "inline";
            timeInput.style.display = "inline";
            daySelect.style.display = "none";
        } else if (optionSelect.value === "recurring") {
            dateInput.style.display = "none";
            timeInput.style.display = "inline";  
            daySelect.style.display = "inline";
        }
    });

    // Add a button to save the date
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save Workout Date";
    dateContainer.appendChild(saveButton);

    // Event listener for save button
    saveButton.addEventListener("click", () => {
        let dates = [];
    
        if (optionSelect.value === "single" && dateInput.value && timeInput.value) {
            // Combine date and time
            const fullDateTime = `${dateInput.value}T${timeInput.value}`;
            dates.push(fullDateTime);  // Save full ISO string (YYYY-MM-DDTHH:mm)
        } else if (optionSelect.value === "recurring" && daySelect.value) {
            const dayOfWeek = daySelect.value;
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();
    
            for (let day = 1; day <= 31; day++) {
                const date = new Date(currentYear, currentMonth, day);
    
                if (date.getMonth() === currentMonth && date.getDay() === daysOfWeek.indexOf(dayOfWeek)) {
                    // Combine date with selected time
                    const datePart = date.toISOString().split('T')[0];
                    const timePart = timeInput.value || "00:00"; // Fallback to midnight if time is not set
                    dates.push(`${datePart}T${timePart}`);
                }
            }
        }
    
        // Retrieve and update session
        let sessions = JSON.parse(localStorage.getItem("sessions")) || [];
        const session = sessions.find(session => session.name === sessionId);
    
        if (session) {
            session.dates = dates;
            localStorage.setItem("sessions", JSON.stringify(sessions));
        } else {
            console.error("Session not found!");
        }
    
        console.log("Workout Date(s) + Time Saved:", dates);
        location.reload();
    });
    

    return dateContainer;  
}



export default newSession;
export { expandSession };