var diceInt;
var oldDiceInt;
var exerciseOptions = [];
var dataLength;
var exerciseTypes = [];

document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').checked = true;
    }
});

function getExercises() {
    return fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            exerciseOptions = data;
        });
}

document.addEventListener("DOMContentLoaded", function () {
    getExercises().then(() => {
        // Initialize your UI or call other functions here
        exerciseTypes = [...new Set(exerciseOptions.map(x => x.type))];
        // var html = ""
        // exerciseTypes.forEach(element => {
        //     html = html + "<option value=" + element + "></option>"
        // });
        // document.getElementById("exerciseType").innerHTML = html;
        // set the innerHTML from 
        // <select id="exerciseType" class="form-control m-2" multiple>
        //     <option value="all">All</option>
        //     <option value="warmUp">Warm Up</option>
        //     <option value="core">Core</option>
        //     <option value="upperBody">Upper Body</option>
        //     <option value="lowerBody">Lower Body</option>
        //     <option value="cardio">Cardio</option>
        // </select>
    var selectElement = document.getElementById("exerciseType");
    exerciseTypes.forEach(type => {
        var option = document.createElement("option");
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        selectElement.appendChild(option);
    });
    });
});

function getExercise() {
    var selectedOptions = [];
    var selectedTypes = Array.from(document.getElementById("exerciseType").selectedOptions).map(option => option.value);
    
    selectedTypes.forEach(element => {
        exerciseOptions.forEach(ex => {
            if (ex.type === element) {
                selectedOptions.push(ex); // Corrected variable name from 'exercise' to 'ex'
            }
        });
    });

    dataLength = selectedOptions.length;

    do {
        diceInt = Math.floor(Math.random() * dataLength);
    } while (diceInt === oldDiceInt);
    
    var exercise = selectedOptions[diceInt - 1]; // Use 'selectedOptions' instead of 'exerciseOptions'
    if (exercise) {
        document.getElementById("name").innerHTML = exercise.name;
        document.getElementById("warmUp").innerHTML = exercise.warmUp;

        if (exercise.timer != null) {
            document.getElementById("txtTimer").innerHTML = exercise.timer;
            document.getElementById("timer").style.display = "block";
        } else {
            document.getElementById("timer").style.display = "none";
        }
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
}

function startTimer() {
    var time = exerciseOptions[diceInt - 1].timer;
    var timeParts = time.split(':');
    var totalSeconds = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
    var display = document.getElementById("txtTimer");

    // Display the initial time immediately
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    display.innerHTML = minutes + ':' + seconds;

    var interval = setInterval(function () {
        if (--totalSeconds < 0) {
            totalSeconds = 0;
            clearInterval(interval);
        } else {
            minutes = Math.floor(totalSeconds / 60);
            seconds = totalSeconds % 60;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            display.innerHTML = minutes + ':' + seconds;
        }
    }, 1000);
}