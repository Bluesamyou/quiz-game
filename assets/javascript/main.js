var gameState = {
  questionArray: [],
  questionIndex: 0,
  timeUp: false,
  correct: 0,
  incorrect: 0,
  timeleft: 10,

};

color = ["red", "green", "violet", "blue"]

var timer;

$("document").ready(function () {
  var checkAnswer = function (choice) {
    if (gameState.timeUp) {
      Swal.fire({
        // Fires enemy defeated message 
        background: 'rgba(0,0,0,0.9)',
        html: `<h1 style="color:red;">Time's Up</h1> 
                <h5 style="color:white;"> The correct answer is <span style="color: greenyellow;">${gameState.questionArray[gameState.questionIndex].correct_answer}</span></h5>`,
        confirmButtonText: "Continue",
        allowOutsideClick: false,
        backdrop: 'rgba(180,255,180,0.2)',
        preConfirm: () => {
          ++gameState.incorrect
            ++gameState.questionIndex
          if (gameState.questionIndex < gameState.questionArray.length) {
            ++gameState.incorrect
            gameState.timeUp = false; 
            gameState.timeleft = 10; 
            ++gameState.questionIndex
            renderQuestion()
          } else {
            gameSummary()
          }

        }
      })

    } else {
      clearTimeout(timer)
      if (choice == gameState.questionArray[gameState.questionIndex].correct_answer) {
        Swal.fire({
          // Fires enemy defeated message 
          background: 'rgba(0,0,0,0.9)',
          html: `<h1 style="color:greenyellow;">Correct</h1>`,
          confirmButtonText: "Continue",
          allowOutsideClick: false,
          backdrop: 'rgba(180,255,180,0.2)',
          preConfirm: () => {
            ++gameState.correct
            ++gameState.questionIndex
            gameState.timeUp = false; 
            gameState.timeleft = 10; 
            if (gameState.questionIndex < gameState.questionArray.length) {
              renderQuestion()
            } else {
              gameSummary()
            }
          }
        })
      } else {
        Swal.fire({
          // Fires enemy defeated message 
          background: 'rgba(0,0,0,0.9)',
          html: `<h1 style="color:red;">Wrong</h1> 
                  <h5 style="color:white;"> The correct answer is <span style="color: greenyellow;">${gameState.questionArray[gameState.questionIndex].correct_answer}</span></h5>`,
          confirmButtonText: "Continue",
          allowOutsideClick: false,
          backdrop: 'rgba(180,255,180,0.2)',
          preConfirm: () => {
            ++gameState.incorrect
            ++gameState.questionIndex
            gameState.timeUp = false; 
            gameState.timeleft = 10; 
            if (gameState.questionIndex < gameState.questionArray.length) {
              renderQuestion()
            } else {
              gameSummary()
            }

          }
        })
      }
    }
  }

  var renderQuestion = function () {
    $('.display-4').empty()
    $('.lead').empty()
    $('.choices').empty()

    $('.display-4').html(`Question ${gameState.questionIndex +1}`);
    $('.lead').html(`${gameState.questionArray[gameState.questionIndex].question}`);
    var incorrect = gameState.questionArray[gameState.questionIndex].incorrect_answers
    var choices = incorrect;
    choices.splice(Math.floor(Math.random() * incorrect.length), 0, gameState.questionArray[gameState.questionIndex].correct_answer);

    choices.map(function (choice, index) {
      var choiceDiv = index % 2 === 0 ? $(`<button class="col-10 col-md-4 offset-md-1 offset-1 ${color[index]} choice" value=${choice.replace(" ","")}>${choice}</button>`) : $(`<button class="col-10 col-md-4  offset-md-2 offset-1 ${color[index]} choice" value=${choice.replace(" ","")}>${choice}</button>`);
      $('.choices').append(choiceDiv)

    });

    timerFunction();

    $('.choice').on("click", function () {
      var selection = $(this).text()
      checkAnswer(selection)
    })

  }

  var gameSummary = function(){
    setTimeout(function(){
      Swal.fire({
        background: 'rgba(0,0,0,0.9)',
        html: `<h1 style="color:green;">Here's how you went</h1> 
                <p style="color:white;">Correct : ${gameState.correct}<p>
                <p style="color:white;">Incorrect : ${gameState.incorrect}<p>`,
        confirmButtonText: "Continue",
        allowOutsideClick: false,
        backdrop: 'rgba(180,255,180,0.2)',
        preConfirm: () => {
          location.reload()
  
        }
      })
    },1000)

  }
  var timerFunction = function () {
    timer =
      setTimeout(function () {
        if (gameState.timeleft === 0) {
          gameState.timeUp = true
          clearTimeout(timer)
          checkAnswer()
        } else {
          --gameState.timeleft
          $('.timer').text(`00:0${gameState.timeleft}`)
          clearTimeout(timer)
          return timerFunction()
        }
      }, 1000)

  }



  $.ajax({
      url: "https://opentdb.com/api.php?amount=10&category=18&type=multiple",
      method: "GET"
    })
    .then(function (result) {
      gameState.questionArray = result.results;
      renderQuestion()
    })
    


});
