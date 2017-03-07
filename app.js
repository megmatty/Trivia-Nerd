// $(document).ready(function(){};



var url = "https://opentdb.com/api.php?amount=12&type=multiple"; //gets mc questions

var response; //holds response data
var counter = 0; //counter for getting next question
var uniqueRandoms = []; //empty array for random numbers
var numRandoms = 4; //how many numbers do you want (1-4)
var correct = 0;
var incorrect = 0;

//AJAX call

$.getJSON(url, getQuestions);


//Get questions
function getQuestions(data) {
	response = data; //store json data in this variable
	console.log(response); //so i can see object
	if (data) { //checks to make sure data has arrived
		buildQuestion(0); //loads first question
	}
}

//Build questions in DOM
function buildQuestion(num) {
	var item = response.results;

	$('#q').html(item[num].question);
		//html method makes the unicode characters render
	$('#mc-' + (makeUniqueRandom() + 1)).html(item[num].incorrect_answers[0]);
	$('#mc-' + (makeUniqueRandom() + 1)).html(item[num].incorrect_answers[1]);
	$('#mc-' + (makeUniqueRandom() + 1)).html(item[num].incorrect_answers[2]);
	$('#mc-' + (makeUniqueRandom() + 1)).html(item[num].correct_answer);
		//randomize answer button text
			//new function to take 1,2,3,4 and randomize
				//math.random + loop to place answers in ids
				//then assign 'mc-' + makeUniqueRandom
}		

//Get Next Button
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


//Answer button handler
$('.answer-buttons').click(function(event) {
	var correctAnswer = response.results[counter].correct_answer; //gets correct answer value from object

	var realAnswer = $('<p>' + correctAnswer + '</p>').text(); //gets the text inside the hidden div
	
	if ( $(this).text() == realAnswer ) { //compares text of button with text of realAnswer
		$(this).addClass('green-button').stop().delay(2000).queue(function() { //light green and wait
			nextQuestion(); //get next question
		});
		correct++;
		$('#score-bar').attr('value', (correct * 10) );
	} else {
		$(this).addClass('red-button').stop().delay(1200).queue(function() { //delay
			$('.answer-buttons').filter(function() {
					return $(this).text() == realAnswer;
				}).addClass('green-button').stop().delay(2000).queue(function() {
					nextQuestion(); //move to next question
				});
			});
		incorrect++;
	}

});


//Random number generator for multiple choice answers - thanks stackoverflow!

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
    uniqueRandoms.splice(index, 1);

    return val;
}

//Category Selector
$('.category').on('click', function(event) {
	var text = $(this).text();
	for (var i = 0; i < categories.length; i++) {
		if (text === categories[i].name) {
			url = url + "&category=" + categories[i].num;
		}
	}
	console.log(url);
	$.getJSON(url, getQuestions); //new AJAX call for that category
	counter = 0; //reset all counters and scores
	correct = 0;
	incorrect = 0;
	$('#score-bar').attr('value', 0);
	buildQuestion(counter);
	$('.category').removeClass('green-button'); //remove class if they switch buttons
	$(this).toggleClass('green-button'); //toggle green on selection
});



//Hide start screen & Game Start Screen loads
$(".start-button").click(function(event) {
	$('.tagline').hide();
	$('.instructions').hide();
	$("#category").hide();
	$(this).hide();
	$("#game").fadeIn('slow').css('display', 'flex');
});

//Play Again button
$('.play-again').click(function(event) {
	$('.end-screen').toggleClass('hide');
	$('.instructions').show();
	$("#category").show();
	$(".category").removeClass('green-button');
	$(".start-button").show();
});

//Game over screen
function endGameDisplay() {
	if (correct >= 8 && correct < 10) {
		$('#game-end-msg').text('So close!');
		$('#bar-msg').text("You didn't fill the bar!");
		$('#final-score').removeClass('hide');
		$('#percent-score').text(correct * 10);
		$('#rank').text(ranks[1]);
	} else if (correct >= 4 && correct <= 7) {
		$('#game-end-msg').text('Not quite!');
		$('#bar-msg').text("You didn't fill the bar!");
		$('#final-score').removeClass('hide');
		$('#percent-score').text(correct * 10);
		$('#rank').text(ranks[2]);
	} else if (correct >= 0 && correct <= 3) {
		$('#game-end-msg').text('Needs work!');
		$('#bar-msg').text("You didn't fill the bar!");
		$('#final-score').removeClass('hide');
		$('#percent-score').text(correct * 10);
		$('#rank').text(ranks[3]);
	} else if (correct >= 10) {
		$('#game-end-msg').text('Way to go!');
		$('#bar-msg').text("You filled the bar!");
		$('#rank').text(ranks[0]);
	}

}

var ranks = ["Trivia Nerd", "Trivia Ninja", "Trivia Pirate", "Trivia Noob"];


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

// $(window).ready(function(){//when window is ready
// 	var user = window.localStorage.getItem("user");
// 	if (!user) {
// 		console.log("no user");
// 		user = "meg";
// 		window.localStorage.setItem("user", user);
// 	}

// 	console.log(user);
// }); 





