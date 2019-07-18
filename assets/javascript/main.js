// Gamestate stored globally so it can be accessed in console for debugging
// TODO: Add all Sweet alert fires to a function

var gameState = {
  questionArray: [],
  questionIndex: 0,
  timeUp: false,
  correct: 0,
  incorrect: 0,
  timeleft: 10,

};

// Color array to add borders to each game choice
color = ["red", "green", "violet", "blue"]

// Defining a global timer variable to be used to keep track of time left per question
var timer;


$("document").ready(function () {
  // Ajax request to get random quix questions
  // Using Ajax over fetch to practice skills learnt in week 6
  $.ajax({
      url: "https://opentdb.com/api.php?amount=10&category=18&type=multiple",
      method: "GET"
    })
    .then(function (result) {
      // Append all questions to the gameState and run render method
      gameState.questionArray = result.results;
      renderQuestion()
    })

  var checkAnswer = function (choice) {
    if (gameState.timeUp) {
      // Fires when time is up
      Swal.fire({
        background: 'rgba(0,0,0,0.9)',
        html: `<h1 style="color:red;">Time's Up</h1> 
                <h5 style="color:white;"> The correct answer is <span style="color: greenyellow;">${gameState.questionArray[gameState.questionIndex].correct_answer}</span></h5>`,
        confirmButtonText: "Continue",
        allowOutsideClick: false,
        backdrop: 'rgba(180,255,180,0.2)',
        preConfirm: function() {
          // Increments incorrect guess and changes the question
          ++gameState.incorrect
          ++gameState.questionIndex
          // Resets timer
          gameState.timeUp = false;
          gameState.timeleft = 10;
          // Checks if all questions have been asked
          if (gameState.questionIndex < gameState.questionArray.length) {
            // Gets next questions
            renderQuestion()
          } else {
            // Shows game summary
            gameSummary()
          }

        }
      })

    } else {
      // Stops the timer
      clearTimeout(timer)
      // Checks if anser is correct
      if (choice == gameState.questionArray[gameState.questionIndex].correct_answer) {
        // Fires correct guess
        Swal.fire({
          background: 'rgba(0,0,0,0.9)',
          html: `<h1 style="color:greenyellow;">Correct</h1>`,
          confirmButtonText: "Continue",
          allowOutsideClick: false,
          backdrop: 'rgba(180,255,180,0.2)',
          preConfirm: function() {
            // Increments correct guess and changes the question
            ++gameState.correct
            ++gameState.questionIndex

            // Resets timer
            gameState.timeUp = false;
            gameState.timeleft = 10;

            // Checks if all questions have been asked
            if (gameState.questionIndex < gameState.questionArray.length) {
              // Gets next question
              renderQuestion()
            } else {
              // Shows game summary
              gameSummary()
            }
          }
        })
      } else {
        // Fires incorrect guess
        Swal.fire({
          background: 'rgba(0,0,0,0.9)',
          html: `<h1 style="color:red;">Wrong</h1> 
                  <h5 style="color:white;"> The correct answer is <span style="color: greenyellow;">${gameState.questionArray[gameState.questionIndex].correct_answer}</span></h5>`,
          confirmButtonText: "Continue",
          allowOutsideClick: false,
          backdrop: 'rgba(180,255,180,0.2)',
          preConfirm: function() {
            // Increments incorrect guesses and changes question
            ++gameState.incorrect
            ++gameState.questionIndex

            // Resets the timer
            gameState.timeUp = false;
            gameState.timeleft = 10;

            // Checks if all questions have been asked
            if (gameState.questionIndex < gameState.questionArray.length) {
              // Gets next question
              renderQuestion()
            } else {
              // Shows game summary
              gameSummary()
            }
          }
        })
      }
    }
  }

  // Renders each question to the DOM
  var renderQuestion = function () {
    // Clears any existing questions and choices
    $('.display-4').empty()
    $('.lead').empty()
    $('.choices').empty()

    // Adds new question to Jumbotron
    $('.display-4').html(`Question ${gameState.questionIndex +1}`);
    $('.lead').html(`${gameState.questionArray[gameState.questionIndex].question}`);

    // Gets correct answer and randomly assigns it to the choices
    var incorrect = gameState.questionArray[gameState.questionIndex].incorrect_answers
    var choices = incorrect;
    choices.splice(Math.floor(Math.random() * incorrect.length), 0, gameState.questionArray[gameState.questionIndex].correct_answer);

    // Turns choices into buttons
    choices.map(function (choice, index) {
      // Changes offset based on button location to make layout cleaner
      var choiceDiv = index % 2 === 0 ? $(`<button class="col-10 col-md-4 offset-md-1 offset-1 ${color[index]} choice" value=${choice.replace(" ","")}>${choice}</button>`) : $(`<button class="col-10 col-md-4  offset-md-2 offset-1 ${color[index]} choice" value=${choice.replace(" ","")}>${choice}</button>`);
      $('.choices').append(choiceDiv)
    });

    // Starts timer
    timerFunction();

    // Runs check answer method when choice is selected
    $('.choice').on("click", function () {
      var selection = $(this).text()
      checkAnswer(selection)
    })

  }

  // Fires games summary modal 
  var gameSummary = function () {
    setTimeout(function () {
      Swal.fire({
        background: 'rgba(0,0,0,0.9)',
        html: `<h1 style="color:green;">Here's how you went</h1> 
                <p style="color:white;">Correct : ${gameState.correct}<p>
                <p style="color:white;">Incorrect : ${gameState.incorrect}<p>`,
        confirmButtonText: "Continue",
        allowOutsideClick: false,
        backdrop: 'rgba(180,255,180,0.2)',
        preConfirm: function() {
          location.reload()
        }
      })
    }, 1000)

  }

  // Timer function for each questions
  var timerFunction = function () {
    timer =
      setTimeout(function () {
        // Checks if timer is done
        if (gameState.timeleft === 0) {
          gameState.timeUp = true
          // Resets timer
          clearTimeout(timer)
          checkAnswer()
        } else {
          // Reduces time by one second
          --gameState.timeleft
          $('.timer').text(`00:0${gameState.timeleft}`)
          clearTimeout(timer)
          return timerFunction()
        }
      }, 1000)

  }
});
