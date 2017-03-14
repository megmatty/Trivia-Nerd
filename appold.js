// $(document).ready(function(){};

var url = "https://opentdb.com/api.php?amount=12&type=multiple"; //gets mc questions

var response; //holds response data
var uniqueRandoms = []; //empty array for random number function
var numRandoms = 4; //varible for random number function
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


//Get Questions
function getQuestions(data) {
//store json data in this variable
	response = data;
	if (data) { //checks to make sure data has arrived 
		console.log(data);
		buildQuestion(0, 0, 0, data);
	} 
	console.log(response); //so i can see object
}

//Build Questions in DOM
function buildQuestion(num, correct, incorrect, item) {
	var item = item.results;
	// console.log(item, num);
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
	activateButtons(num, item[num].correct_answer, correct, incorrect);

}

function activateButtons(num, correctAnswer, correct, incorrect) { //keeps other buttons from clicking after 1st time
	$('.answer-buttons').bind('click', function(event) {
		$('.answer-buttons').unbind('click');
		checkAnswer(num, correctAnswer, this, correct, incorrect);
		// console.log(correctAnswer);
	});
}


//Animate progress bar
function animateBar(correct) {
	var progressbar = $('#score-bar'); 
    max = (correct * 10);
    time = 20;  //speed
    value = progressbar.val();
 
  var loading = function() {
      value += 0.5; //increment of bar advancement
      addValue = progressbar.val(value);
 
      if (value > max) {
          clearInterval(animate);                
      }
  };
 
  var animate = setInterval(function() {
      loading();
  }, time);
}


//Check answer for correct/incorrect and score
function checkAnswer(num, correctAnswer, button, correct, incorrect) {
	// console.log(button);
	var realAnswer = $('<p>' + correctAnswer+ '</p>').text(); //converts unicode chars & gets text
	if ( $(button).text() == realAnswer ) { //compares text of button with text of realAnswer
		correct++; //score correct
		$('#right-sfx')[0].play(); //play right sfx
		animateBar(correct); //advance progress bar
		$(button).addClass('green-button').stop().delay(2000).queue(function() { //light green and wait
			nextQuestion(num, correct, incorrect); //get next question
		});
		
	} else {
		$('#wrong-sfx')[0].play(); //play wrong sfx
		$(button).addClass('red-button').stop().delay(1200).queue(function() { //mark red and wait
			$('.answer-buttons').filter(function() { //find the correct answer
					return $(this).text() == realAnswer;
				}).addClass('green-button').stop().delay(2000).queue(function() { //display correct answer in green
					incorrect++;
					nextQuestion(num, correct, incorrect); //move to next question
				});
			});
	}
		// console.log(realAnswer);

}

//Advance Next Question
function nextQuestion(num, correct, incorrect) {
	$('.answer-buttons').removeClass('green-button');
	$('.answer-buttons').removeClass('red-button');
	if (num <=10 && correct < 10) {
		num = num + 1;
		buildQuestion(num, correct, incorrect, response);
	} else {
		$('#game').fadeOut('slow').css('display', 'none');
		$('#game-end').toggleClass('hide');
		endGameDisplay(correct);
	}
}

//Category Button Handler
$('.category').on('click', function(event) {
	var text = $(this).text(); //get text of button
	for (var i = 0; i < categories.length; i++) { //search object for matching category
		if (text === categories[i].name) {
			url = url + "&category=" + categories[i].num; //return category number & attach to url
		} else if (text === "Random") { //if random category button
			url = 'https://opentdb.com/api.php?amount=12&type=multiple'; //use base url
		}
	}
	correct = 0;
	incorrect = 0;
	$('#score-bar').attr('value', 0); //reset score bar to 0
	$('.category').removeClass('green-button'); //remove class if they switch categories
	$(this).toggleClass('green-button'); //toggle green on selection
});

//Start Button Handler
$(".start-button").click(function(event) { //on clicking start button
	$.getJSON(url, getQuestions) ; //Do an AJAX call for that category
		if ($(window).width()> 1000){ //show date display only >1000px
			$('.last-display').removeClass('hide');
	    } else {
	    	$('.last-display').addClass('hide');
	    }
	$('.instr-container').hide(); //hide everything on start screen
	$("#category").hide();
	$(this).hide();
	$("#game").fadeIn('slow').css('display', 'flex'); //show game screen
});

//Play Again Button Handler
$('.play-again').click(function(event) {
	$('.end-screen').toggleClass('hide'); //hide end game screen
	$('.sadface').addClass('hide');
	$('.goldmedal').addClass('hide');
	$('.instr-container').show(); //show start screen items
		if ($(window).width()> 1000){ //show date display only >1000px
			$('.last-display').removeClass('hide');
	    } else {
	    	$('.last-display').addClass('hide');
	    }
	$("#category").show();
	$(".category").removeClass('green-button'); //reset category button states
	$(".start-button").show();
	$('#last-play').text(window.localStorage.getItem('lastDate'));
});

//Display Game Over Screen Text
function endGameDisplay(correct) {
	if (correct >= 7 && correct <= 9) { //7-9 Correct
		$('#game-end-msg').text('So close!');
		$('#bar-msg').text("You didn't fill the bar!");
		$('.sadface').removeClass('hide');
		$('#final-score').removeClass('hide');
		$('#percent-score').text(correct * 10);
		$('#rank').text(ranks[1]); //pull appropriate rank item & display
		$('#fail-sfx')[0].play(); //play fail sfx
	} else if (correct >= 4 && correct <= 6) { //4-6 Correct
		$('#game-end-msg').text('Not quite!');
		$('#bar-msg').text("You didn't fill the bar!");
		$('.sadface').removeClass('hide');
		$('#final-score').removeClass('hide');
		$('#percent-score').text(correct * 10);
		$('#rank').text(ranks[2]);
		$('#fail-sfx')[0].play(); //play fail sfx
	} else if (correct >= 0 && correct <= 3) { //0-3 Correct
		$('#game-end-msg').text('Needs work!');
		$('#bar-msg').text("You didn't fill the bar!");
		$('.sadface').removeClass('hide');
		$('#final-score').removeClass('hide');
		$('#percent-score').text(correct * 10);
		$('#rank').text(ranks[3]);
		$('#fail-sfx')[0].play(); //play fail sfx
	} else if (correct >= 10) { //10+ correct
		$('#game-end-msg').text('Way to go!');
		$('.goldmedal').removeClass('hide');
		$('#final-score').addClass('hide');
		$('#bar-msg').text("You filled the bar!");
		$('#rank').text(ranks[0]);
		$('#success-sfx')[0].play(); //play success sfx
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


// Session Token
// $(window).ready(function(){//when window is ready
// 	var savedToken = localStorage.getItem('userToken');
// 	console.log(savedToken);
// 	if (savedToken) {
// 		url = url + "&token=" + savedToken;
// 	} else {
// 		$.getJSON('https://opentdb.com/api_token.php?command=request', function(r) {
// 			console.log(r.token);
// 			if (r.response_code == 4) {
// 				$.getJSON('https://opentdb.com/api_token.php?command=reset&token=' + savedToken);
// 				// $.getJSON('https://opentdb.com/api_token.php?command=request');
// 				window.localStorage.setItem('userToken', null);
// 				location.reload();
// 			}
// 			window.localStorage.setItem('userToken', r.token);
// 		});
// 	}
// });



//Save Date & display last played
$(window).ready(function(){//when window is ready
	var date = new Date(); //get todays date
	var prevDate = window.localStorage.getItem('lastDate'); 
	// window.localStorage.setItem('lastDate', date); //full date and time
	$('#last-play').text(prevDate);
	window.localStorage.setItem('lastDate', date.toISOString().substring(0, 10)); //format 2017-03-12
	console.log(localStorage.lastDate);
	console.log(prevDate);
});

//set date of last played on start screen
//right wrong sounds
//total correct score always, animate coins and sound or rolls number



















