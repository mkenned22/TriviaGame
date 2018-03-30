$(document).ready(function() {

    function createPageLayout(){
        $(".container").text("");
        
        var column = $("<div>");
        column.addClass("col-md-12");
        column.attr("id","content");

        var row = $("<div>");
        row.addClass("row");
        $(row).append(column);

        $(".container").append(row);
    }

    function goHome(){
        createPageLayout();
        $("#content").html("<h1>Let's Play Trivia</h1><br>");
        createPlayButton("Play");
    }

    function createPlayButton(text){
        var button = $("<button>");
        button.html("<p>"+text+"</p>");
        button.on("click",playGame);
        button.addClass("btn btn-primary btn-lg");
        $("#content").append(button);
    }

    function playGame(){
        createPageLayout();
        
        var title = $("<div>");
        title.attr("id","title");
        $("#content").append(title);

        var question = $("<div>");
        question.attr("id","question");
        $("#content").append(question);
        
        for(j=0;j<4;j++){
            var answers = $("<div>");
            answers.attr("id","answers");
            $("#content").append(answers);
        }

        var timer = $("<div>");
        timer.attr("id","timer");
        $("#content").append(timer);

        queryURL = "https://opentdb.com/api.php?amount=3&type=multiple"
        $.ajax({
            url: queryURL,
            method: "GET"
            }).then(function(response) {
            console.log(response);
            gameData = response.results;
            getQuestion();
            });
    }

    function count(){
        time--;
        $("#timer").text("Remaining Time: " + time);
        if(time === 0){
            displayAnswer();
        }
    }

    function getQuestion(){
        $("#answers").empty();
        var letters = ["a) ", "b) ", "c) ", "d) "];
        $("#title").html("<h1>Question " +(parseInt(i)+1)+ "</h1>");
        $("#question").html("<h5>" +gameData[i].question+ "</h5>");
        var array = gameData[i].incorrect_answers;
        array.splice(getRandomInt(array.length +1),0,gameData[i].correct_answer);
        for(j=0;j<array.length;j++){
            var choice = array[j]
            choice = choice.replace(/[^a-zA-Z0-9 ]/g, "");
            choice = choice.replace(/ /g,'');
            var button = $("<button>");
            button.html("<p>"+letters[j]+array[j]+"</p>");
            button.attr("id",choice);
            button.on("click",displayAnswer);
            button.addClass("btn btn-primary btn-lg text-left btn-wrap-text");
            $("#answers").append(button);
        }

        reset();
        start();
    }

    function displayAnswer(){
        stop();
        var answer = this.id;
        var id = "#"+answer;
        var correctAnswer = gameData[i].correct_answer;
        correctAnswer = correctAnswer.replace(/[^a-zA-Z0-9 ]/g, "");
        correctAnswer = correctAnswer.replace(/ /g,'');
        var correctid = "#"+correctAnswer;
        console.log(answer);
        console.log(correctAnswer);
        if(time === 0){
            $("#question").append("<p>Time's up!</p>");
            $(id).css("background-color","green");
        }
        else if(answer === correctAnswer){
            correctAnswers++
            $(id).css("background-color","green");
            $("#question").append("<p class='correct'>That is correct!</p>");;
        }
        else{
            $(id).css("background-color","red");
            $(correctid).css("background-color","green");
            $("#question").append("<p class='incorrect'>That is incorrect!</p>");
        }
        
        setTimeout(function(){
            if(i<gameData.length-1){
                i++;
                getQuestion();
            }
            else{
                goGameOver();
            }    
        },5000)
    }

    function goGameOver(outcome){
        createPageLayout();
        $("#content").html("<div><h1>Game Over</h1></div>")
        $("#content").append("<div><h5>You answered "+correctAnswers+" of "+gameData.length+" questions correctly.</h5></div>")
        correctAnswers = 0;
        answerChoices = [];
        createPlayButton("Play Again");
    }
    
    function start() {
        if (!clockRunning) {
        intervalId = setInterval(count, 1000);
        clockRunning = true;
        }
    }

    function stop() {
        clearInterval(intervalId);
        clockRunning = false;
    }

    function reset() {
        time = 15;
        $("#timer").text("Remaining Time: " + time);
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    
    var intervalId;
    var clockRunning = false;
    var i=0;
    var answerChoices = [];
    var correctAnswers = 0;
    goHome();
    
});