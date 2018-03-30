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
        createPlayButton();
    }

    function createPlayButton(){
        var button = $("<button>");
        button.html("<p>Play</p>");
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
            var button = $("<button>");
            button.html("<p>"+letters[j]+array[j]+"</p>");
            button.attr("id",array[j]);
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
        if(time === 0){
            $("#question").append("<p>Time's up!<br>The correct answer is: " +gameData[i].correct_answer+ "</p>");
            answerChoices.push('<p class="incorrect">No answer provided</p><p class="correct">&nbsp;&nbsp;'+gameData[i].correct_answer+'</p>')
        }
        else if(answer === gameData[i].correct_answer){
            correctAnswers++
            $("#question").append("<p>That is correct!</p>");;
            answerChoices.push('<p class="correct">'+answer+'</p>');
        }
        else{
            $("#question").append("<p>That is incorrect!<br>The correct answer is: " +gameData[i].correct_answer+ "</p>");
            answerChoices.push('<p class="incorrect">'+answer+'</p><p class="correct">&nbsp;&nbsp;'+gameData[i].correct_answer+'</p>')
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
        for(j=1;j<gameData.length+1;j++){

            var string = "<div class='correctAnswers'><strong>Question "+j+")</strong> " +gameData[j-1].question+"<br><strong>Your Answer:</strong> "+answerChoices[j-1]+"</div>"
            $("#content").append(string);
            $("#content").append($("<br>"));

        }
        i=0;
        correctAnswers = 0;
        answerChoices = [];
        createPlayButton();
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