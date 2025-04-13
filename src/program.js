// Create a new exercise button dynamically
function createExerciseButton(exercise) {
    const button = document.createElement("button");
    button.textContent = exercise.name;
    button.classList.add("exerciseButton");
    const programBox = document.getElementById("programloadout");
    const programBoxHeader = document.getElementById("program");
    const programBoxInput = document.getElementById("programInputSpace");
    const programBoxButtonSpace = document.getElementById("programButtonSpace");
    

    button.addEventListener("click", () => {

        const allExerciseButtons = document.querySelectorAll(".exerciseButton");
        allExerciseButtons.forEach(btn => btn.disabled = true);

        button.classList.add("workoutHighlight");
        // Create a div for sets and reps input
        const inputBox = setsAndReps();
        programBoxInput.appendChild(inputBox);

        // Create a save button for the input
        const saveButton = document.createElement("button");
        saveButton.textContent = "Save Sets & Reps";
        programBoxInput.appendChild(saveButton);

        // When the save button is clicked, save the workout data to localStorage
        saveButton.addEventListener("click", () => {

            const exerciseButtons = programBoxButtonSpace.querySelectorAll(".exerciseButton");
            exerciseButtons.forEach(button => button.remove());

            const setsValue = inputBox.querySelector("#setsInput").value;
            const repsValue = inputBox.querySelector("#repsInput").value;

            // Ensure the data is valid before saving
            if (setsValue && repsValue) {
                const workoutData = {
                    sessionName: exercise.sessionName,  // Dynamically passed name from exercise object
                    exercise: exercise.name,     // Exercise name
                    sets: setsValue,
                    reps: repsValue
                };

                // Retrieve current workouts from localStorage
                let workouts = JSON.parse(localStorage.getItem("workouts")) || [];

                // Add new workout data
                workouts.push(workoutData);

                // Save the updated workouts list back to localStorage
                localStorage.setItem("workouts", JSON.stringify(workouts));

                // Show the saved workout in the UI
                programBox.appendChild(generateWorkoutDiv(workoutData));

                // Clean up the UI
                saveButton.remove();
                inputBox.remove();

                // Recreate the "New Workout Program" button
                const newProgramButton = document.createElement("button");
                newProgramButton.textContent = "Add Exercise";
                programBoxHeader.appendChild(newProgramButton);

                // Remove exercise buttons
                const exerciseButtons = programBox.querySelectorAll(".exerciseButton");
                exerciseButtons.forEach(button => button.remove());

                // Add the event listener for the new program button
                newProgramButton.addEventListener("click", () => {
                    newProgramButton.remove();

                    // Define exercises in a modular way
                    const sessionName = exercise.sessionName;
                    const exercises = [
                        { name: "Bench Press", sessionName: sessionName },
                        { name: "Push Ups", sessionName: sessionName },
                        { name: "Squats", sessionName: sessionName }
                    ];

                    // Create exercise buttons dynamically
                    exercises.forEach(exercise => {
                        const exerciseButton = createExerciseButton(exercise);
                        programBoxButtonSpace.appendChild(exerciseButton);
                    });
                });
            } else {
                alert("Please enter both sets and reps.");
            }
        });
    });

    return button;
}

// Generate the div that displays the workout data
function generateWorkoutDiv(workoutData) {
    const box = document.createElement("div");
    box.classList.add("workout");

    const headerBar = document.createElement("div");
    headerBar.classList.add("headerBar");

    const workoutName = document.createElement("div");
    workoutName.textContent = workoutData.exercise;

    const sets = document.createElement("div");
    sets.textContent = `Sets: ${workoutData.sets}`;

    const reps = document.createElement("div");
    reps.textContent = `Reps: ${workoutData.reps}`;

    // Create a delete button to remove this workout
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Exercise";
    deleteButton.addEventListener("click", () => {
        // Remove the workout from the DOM and localStorage
        box.remove();
        let workouts = JSON.parse(localStorage.getItem("workouts")) || [];
        workouts = workouts.filter(workout =>
            workout.sessionName !== workoutData.sessionName ||
            workout.exercise !== workoutData.exercise ||
            workout.sets !== workoutData.sets ||
            workout.reps !== workoutData.reps
        );
        localStorage.setItem("workouts", JSON.stringify(workouts));
    });

    headerBar.appendChild(workoutName);
    headerBar.appendChild(deleteButton);
    box.appendChild(headerBar);
    box.appendChild(sets);
    box.appendChild(reps);
    

    return box;
}

// Function to generate input fields for sets and reps
function setsAndReps() {
    const box = document.createElement("div");
    const sets = document.createElement("input");
    sets.type = "number";
    sets.id = "setsInput";  // id for easy reference
    const reps = document.createElement("input");
    reps.type = "number";
    reps.id = "repsInput";  // id for easy reference
    const setsLabel = document.createElement("div");
    setsLabel.textContent = ("Sets:");
    const repsLabel = document.createElement("div");
    repsLabel.textContent = ("Reps:");
    box.appendChild(setsLabel);
    box.appendChild(sets);
    box.appendChild(repsLabel);
    box.appendChild(reps);

    return box;
}

// Load saved workouts from localStorage and display them
function loadWorkouts(sessionName) {
    const programBox = document.getElementById("programloadout");
    const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
    programBox.innerHTML = "";

    // Only load workouts matching this session
    const filtered = workouts.filter(workout => workout.sessionName === sessionName);
    filtered.forEach(workout => {
        programBox.appendChild(generateWorkoutDiv(workout));
    });
}

// Set up your session and exercise buttons
function programSetup(sessionName) {
    const programBox = document.getElementById("program");
    const newProgramButton = document.createElement("button");
    const programBoxButtonSpace = document.getElementById("programButtonSpace");
    newProgramButton.textContent = "Add Exercise";
    programBox.appendChild(newProgramButton);
    loadWorkouts(sessionName);  // Load existing workouts for this session

    newProgramButton.addEventListener("click", () => {
        newProgramButton.remove();

        // Define exercises in a modular way
        const exercises = [
            { name: "Bench Press", sessionName: sessionName },
            { name: "Push Ups", sessionName: sessionName },
            { name: "Squats", sessionName: sessionName }
        ];

        // Create exercise buttons dynamically
        exercises.forEach(exercise => {
            const exerciseButton = createExerciseButton(exercise);
            programBoxButtonSpace.appendChild(exerciseButton);
        });
    });
}

export default programSetup;
