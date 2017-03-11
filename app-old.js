// $(document).ready(function(){};

var url = "https://opentdb.com/api.php?amount=12&type=multiple"; //gets mc questions

var response; //holds response data
var counter = -1; //counter for getting next question
var uniqueRandoms = []; //empty array for random number function
var numRandoms = 4; //varible for random number function
var correct = 0; //number correct
var incorrect = 0; //number incorrect
var ranks = ["Trivia Nerd", "Trivia Ninja", "Trivia Pirate", "Trivia Noob"]; //array for ranks
var categories = [ //API does not supply categories numbers in JSON response
	{
		name: "General Knowledge",
	 	num : 9
	},
	{
		name: "Books",
		num: 10
	},	
	{
		name: "Film",
		num: 11
	},
	{
		name: "Music",
		num: 12
	},
	{
		name: "Television",
		num: 14
	},
	{	
		name: "Science & Nature",
		num: 17
	},
	{
		name: "Geography",
		num: 22
	},
	{
		name: "Art",
		num: 25
	},
	{
		name: "Sports",
		num: 21
	},
	{
		name: "Animals",
		num: 27
	},

	{
		name: "Mythology",
		num: 20
	},
	{
		name: "Comics",
		num: 29
	},
	{
		name: "History",
		num: 23
	},
	{
		name: "Politics",
		num: 24
	},
	{
		name: "Computers",
		num: 18
	},
	{
		name: "Celebrities",
		num: 26
	},
	{
		name: "Board Games",
		num: 16
	},
	{
		name: "Mathematics",
		num: 19
	},
	{
		name: "Vehicles",
		num: 28
	},
	{
		name: "Cartoons",
		num: 32
	},
	{
		name: "Video Games",
		num: 15
	}
];


//Initial AJAX call

$.getJSON(url, getQuestions);


//Get Questions
function getQuestions(data) {
	response = data; //store json data in this variable
	console.log(response); //so i can see object
	if (data) { //checks to make sure data has arrived
		// buildQuestion(0); //loads first question
		nextQuestion();
	}
}

//Build Questions in DOM
function buildQuestion(num) {
	var item = response.results;

	console.log(counter);
	$('#q').html(item[num].question);
		//html method makes the unicode characters render
	$('#mc-' + (makeUniqueRandom() + 1)).html(item[num].incorrect_answers[0]);
	$('#mc-' + (makeUniqueRandom() + 1)).html(item[num].incorrect_answers[1]);
	$('#mc-' + (makeUniqueRandom() + 1)).html(item[num].incorrect_answers[2]);
	$('#mc-' + (makeUniqueRandom() + 1)).html(item[num].correct_answer);
		//randomize answer button text
			//new function to take 1,2,3,4 and randomize
				//math.random + loop to place answers in ids
				//then assign 'mc-' + makeUniqueRandom + 1
}		

//Get Next Question
function nextQuestion() { //next button
	if (counter <=10) {
		counter = (counter + 1); //advance counter by 1
		buildQuestion(counter);
	} else if (counter >=11) {
		counter = 0; //reset counter
		$('#game').fadeOut('slow').css('display', 'none'); //hide question area
		$('#game-end').toggleClass('hide');
		endGameDisplay();
	}

	$('.answer-buttons').removeClass('green-button');
	$('.answer-buttons').removeClass('red-button');


}; 

//Answer Button Handler
$('.answer-buttons').click(function(event) {
	var correctAnswer = response.results[counter].correct_answer; //gets correct answer value from object

	var realAnswer = $('<p>' + correctAnswer + '</p>').text(); //converts unicode chars & gets text
	
	if ( $(this).text() == realAnswer ) { //compares text of button with text of realAnswer
		$(this).addClass('green-button').stop().delay(2000).queue(function() { //light green and wait
			nextQuestion(); //get next question
		});
		correct++; //increment correct answer
		$('#score-bar').attr('value', (correct * 10) ); //advance progress bar 10% (10/100)
	} else {
		$(this).addClass('red-button').stop().delay(1200).queue(function() { //mark red and wait
			$('.answer-buttons').filter(function() { //find the correct answer
					return $(this).text() == realAnswer;
				}).addClass('green-button').stop().delay(2000).queue(function() { //display correct answer in green
					nextQuestion(); //move to next question
				});
			});
		incorrect++; //increment incorrect answer
	}

});

//Category Button Handler
$('.category').on('click', function(event) {
	var text = $(this).text(); //get text of button
	for (var i = 0; i < categories.length; i++) { //search object for matching category
		if (text === categories[i].name) {
			url = url + "&category=" + categories[i].num; //return category number & attach to url
		}
	}
	$.getJSON(url, getQuestions); //Do new AJAX call for that category
	counter = 0; //reset all counters and scores
	correct = 0;
	incorrect = 0;
	$('#score-bar').attr('value', 0); //reset score bar to 0
	buildQuestion(counter);
	$('.category').removeClass('green-button'); //remove class if they switch categories
	$(this).toggleClass('green-button'); //toggle green on selection
});

//Start Button Handler
$(".start-button").click(function(event) { //on clicking start button
	$('.tagline').hide(); //hide everything on start screen
	$('.instructions').hide();
	$("#category").hide();
	$(this).hide();
	$("#game").fadeIn('slow').css('display', 'flex'); //show game screen
});

//Play Again Button Handler
$('.play-again').click(function(event) {
	$('.end-screen').toggleClass('hide'); //hide end game screen
	$('.instructions').show(); //show start screen items
	$("#category").show();
	$(".category").removeClass('green-button'); //reset category button states
	$(".start-button").show();
});

//Display Game Over Screen Text
function endGameDisplay() {
	if (correct >= 8 && correct < 10) { //8-10 Correct
		$('#game-end-msg').text('So close!');
		$('#bar-msg').text("You didn't fill the bar!");
		$('#final-score').removeClass('hide');
		$('#percent-score').text(correct * 10);
		$('#rank').text(ranks[1]); //pull appropriate rank item & display
	} else if (correct >= 4 && correct <= 7) { //4-7 Correct
		$('#game-end-msg').text('Not quite!');
		$('#bar-msg').text("You didn't fill the bar!");
		$('#final-score').removeClass('hide');
		$('#percent-score').text(correct * 10);
		$('#rank').text(ranks[2]);
	} else if (correct >= 0 && correct <= 3) { //0-3 Correct
		$('#game-end-msg').text('Needs work!');
		$('#bar-msg').text("You didn't fill the bar!");
		$('#final-score').removeClass('hide');
		$('#percent-score').text(correct * 10);
		$('#rank').text(ranks[3]);
	} else if (correct >= 10) { //10+ correct
		$('#game-end-msg').text('Way to go!');
		$('#bar-msg').text("You filled the bar!");
		$('#rank').text(ranks[0]);
	}

}

//Random Number Generator for MC answer buttons (thanks stackoverflow)

function makeUniqueRandom() {
    // refill the array if needed
    if (!uniqueRandoms.length) { //if array is not full
    	for (var i = 0; i < numRandoms; i++) {
    		uniqueRandoms.push(i); //push the numbers into the array
    	}
    }
    var index = Math.floor(Math.random() * uniqueRandoms.length); 
    var val = uniqueRandoms[index]; //gets a number from array by a random index

    //removes that value from the array
    uniqueRandoms.splice(index, 1); //remaining numbers to assign until array exhausted

    return val;
}

//Local Storage
// $(window).ready(function(){//when window is ready
// 	var user = window.localStorage.getItem("user");
// 	if (!user) {
// 		console.log("no user");
// 		user = "meg";
// 		window.localStorage.setItem("user", user);
// 	}

// 	console.log(user);
// }); 





