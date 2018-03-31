$(document).ready(function () {

    // go to the home page
    function goHome() {
        // default page layout
        createPageLayout();
        $("#content").html("<h1>IQ Trivia</h1>");
        $("#content").append("<h5>No host, no marketing, just trivia</h5>");
        // play button
        createPlayButton("Play");
        // dropdown for trivia categories
        createDropdown();
    }

    // begin to play the game when pressing the play button
    // makes the ajax call to get the data from opentdb
    // lays out the page structure
    function playGame() {
        var categories = {
            'Any Category': '',
            'General Knowledge': 'category=9',
            'Entertainment: Books': 'category=10',
            'Entertainment: Film': 'category=11',
            'Entertainment: Music': 'category=12',
            'Entertainment: Musicals & Theatres': 'category=13',
            'Entertainment: Television': 'category=14',
            'Entertainment: Video Games': 'category=15',
            'Entertainment: Board Games': 'category=16',
            'Science & Nature': 'category=17',
            'Science: Computers': 'category=18',
            'Science: Mathematics': 'category=19',
            'Mythology': 'category=20',
            'Sports': 'category=21',
            'Geography': 'category=22',
            'History': 'category=23',
            'Politics': 'category=24',
            'Art': 'category=25',
            'Celebrities': 'category=26',
            'Animals': 'category=27',
            'Vehicles': 'category=28',
            'Entertainment: Comics': 'category=29',
            'Science: Gadgets': 'category=30',
            'Entertainment: Japanese Anime & Manga': 'category=31',
            'Entertainment: Cartoon & Animation': 'category=32'
        }

        // constructing query
        queryURL = "https://opentdb.com/api.php?amount=10&type=multiple";
        queryURL = queryURL + "&" + categories[$("#dropdown").val()];

        // restoring default page layout
        createPageLayout();

        var title = $("<div>");
        title.attr("id", "title");
        $("#content").append(title);

        var question = $("<div>");
        question.attr("id", "question");
        $("#content").append(question);

        var answers = $("<div>");
        answers.attr("id", "answers");
        $("#content").append(answers);
        
        // creating the div for the timer
        var timer = $("<div>");
        timer.attr("id", "timer");
        $("#content").append(timer);

        // ajax call
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            gameData = response.results;
            getQuestion();
        });
    }

    // display the specific question in loop
    function getQuestion() {
        
        // wipe the previous answers
        $("#answers").empty();
        
        // populating question number and question
        $("#title").html("<h1>Question " + (parseInt(i) + 1) + "</h1>");
        $("#question").html("<h5>" + gameData[i].question + "</h5>");
        
        // create random array of answer choices
        var array = gameData[i].incorrect_answers;
        array.splice(getRandomInt(array.length + 1), 0, gameData[i].correct_answer);
        
        var letters = ["a) ", "b) ", "c) ", "d) "];
        
        // loop through answers and create answer buttons
        for (j = 0; j < array.length; j++) {
            
            // removing regex and spaces from button id
            var choice = array[j]
            choice = choice.replace(/[^a-zA-Z0-9 ]/g, "");
            choice = choice.replace(/ /g, '');

            // creating button and attributes
            var button = $("<button>");
            button.html("<p>" + letters[j] + array[j] + "</p>");
            button.attr("id", choice);
            button.on("click", displayAnswer);
            button.addClass("btn btn-primary btn-lg text-left btn-wrap-text");
            $("#answers").append(button);
        }

        // start the timer over again
        reset();
        start();
    }

    // once an answer is chosen, or the timer runs out...
    function displayAnswer() {

        // stop the clock
        stop();

        // save answer and id in var
        var answer = this.id;
        var id = "#" + answer;

        // take the regex out of correct answer for comparison to selected answer
        var correctAnswer = gameData[i].correct_answer;
        correctAnswer = correctAnswer.replace(/[^a-zA-Z0-9 ]/g, "");
        correctAnswer = correctAnswer.replace(/ /g, '');
        var correctid = "#" + correctAnswer;

        // highlight the correct answer in GREEN
        $(correctid).css("background-color", "green");

        // if time expires...
        if (time === 0) {
            $("#question").append("<p>Time's up!</p>");
        }
        // if correct answer...
        else if (answer === correctAnswer) {
            correctAnswers++
            $("#question").append("<p class='correct'>That is correct!</p>");;
        }
        // if incorrect answer...
        else {
            $(id).css("background-color", "red");
            $("#question").append("<p class='incorrect'>That is incorrect!</p>");
        }

        // wait 4 seconds before moving on to next question or the end of the game
        setTimeout(function () {
            if (i < gameData.length - 1) {
                i++;
                getQuestion();
            }
            else {
                goGameOver();
            }
        }, 4000)
    }

    // after 10 questions, go to game over
    function goGameOver(outcome) {

        // restore default page layout  
        createPageLayout();

        $("#content").html("<div><h1>Game Over</h1></div>")
        $("#content").append("<div><h5>You answered " + correctAnswers + " of " + gameData.length + " questions correctly.</h5></div>")
        correctAnswers = 0;
        answerChoices = [];

        // populate the play again button and dropdown for choices
        createPlayButton("Play Again");
        createDropdown()
    }

    // this function is used to randomly determine the order or the answers
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    // default page layout
    function createPageLayout() {
        $(".container").text("");
        
        // column
        var column = $("<div>");
        column.addClass("col-md-12");
        column.attr("id", "content");

        // row
        var row = $("<div>");
        row.addClass("row");
        $(row).append(column);

        $(".container").append(row);
    }

    // dropdown for categories
    function createDropdown() {

        var div = $("<div>");
        div.html('<select id="dropdown"></select>')
        $("#content").append(div);

        // array of categories
        var cats = new Array('Any Category',
            'General Knowledge',
            'Entertainment: Books',
            'Entertainment: Film',
            'Entertainment: Music',
            'Entertainment: Musicals & Theatres',
            'Entertainment: Television',
            'Entertainment: Video Games',
            'Entertainment: Board Games',
            'Science & Nature',
            'Science: Computers',
            'Science: Mathematics',
            'Mythology',
            'Sports',
            'Geography',
            'History',
            'Politics',
            'Art',
            'Celebrities',
            'Animals',
            'Vehicles',
            'Entertainment: Comics',
            'Science: Gadgets',
            'Entertainment: Japanese Anime & Manga',
            'Entertainment: Cartoon & Animation'
        );
        $("#dropdown").find('option').remove();
        for (k = 0; k < cats.length; k++) {
            $("#dropdown").append('<option value="' + cats[k] + '">' + cats[k] + '</option>');
        }
    }

    // play button
    function createPlayButton(text) {
        var button = $("<button>");
        button.html("<p>" + text + "</p>");
        button.on("click", playGame);
        button.addClass("btn btn-primary btn-lg");
        $("#content").append(button);
    }

    // Timer Functions
    // display the countdown
    function count() {
        time--;
        $("#timer").text("Remaining Time: " + time);
        if (time === 0) {
            displayAnswer();
        }
    }
    // start the timer
    function start() {
        if (!clockRunning) {
            intervalId = setInterval(count, 1000);
            clockRunning = true;
        }
    }
    // stop the timer
    function stop() {
        clearInterval(intervalId);
        clockRunning = false;
    }
    // reset the timer
    function reset() {
        time = 8;
        $("#timer").text("Remaining Time: " + time);
    }

    // End of Timer Functions

    // initialize variables
    var intervalId;
    var clockRunning = false;
    var i = 0;
    var answerChoices = [];
    var correctAnswers = 0;

    //execute the goHome function which initiates the game
    goHome();

});