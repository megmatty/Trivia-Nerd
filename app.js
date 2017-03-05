// $(document).ready(function(){};



var url = "https://opentdb.com/api.php?amount=10&type=multiple"; //gets mc questions

var response; //holds response data
var counter = 0; //counter for getting next question
var uniqueRandoms = []; //empty array for random numbers
var numRandoms = 4; //how many numbers do you want (1-4)
var correct = 0;
var incorrect = 0;


//AJAX call

$.getJSON(url, getQuestions);



function getQuestions(data) {
	response = data; //store json data in this variable
	console.log(response); //so i can see object
	if (data) { //checks to make sure data has arrived
		buildQuestion(0); //loads first question
	}
}


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
	if (counter <=8) {
		counter = (counter + 1); //advance counter by 1
	} else if (counter >=9) {
		counter = 0; //reset counter
		$('#game').toggleClass('hide'); //hide question area
	}

	$('.answer-buttons').removeClass('green-button');
	$('.answer-buttons').removeClass('red-button');
	buildQuestion(counter);

}; //in final build, this should automatically advance without button

//setTimeout(function(){...},2000)



//Answer button handler
$('.answer-buttons').click(function(event) {
	var correctAnswer = response.results[counter].correct_answer; //gets correct answer value from object

	var realAnswer = $('<p>' + correctAnswer + '</p>').text(); //gets the text inside the hidden div
	
	if ( $(this).text() == realAnswer ) { //compares text of button with text of realAnswer
		$(this).addClass('green-button').stop().delay(1800).queue(function() { //light green and wait
			nextQuestion(); //get next question
		});
		correct++;
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
	// displayScore(); //score

});

// function displayScore() { //displays score
// 	score = correct / (correct + incorrect);
// 	console.log(score);
// 	console.log(correct * 10);
// }


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

	$.getJSON(url, getQuestions);
	counter = 0;
	correct = 0;
	incorrect = 0;
	buildQuestion(counter);
	$(this).addClass('green-button');
});


//Hide start screen & load game screen
$(".start-button").click(function(event) {
	$('.tagline').hide();
	$('.instructions').hide();
	$("#category").hide();
	$(this).hide();
	$("#game").fadeIn('slow').css('display', 'flex');
});

// $(window).ready(function(){//when window is ready
// 	var user = window.localStorage.getItem("user");
// 	if (!user) {
// 		console.log("no user");
// 		user = "meg";
// 		window.localStorage.setItem("user", user);
// 	}

// 	console.log(user);
// }); 

// var random = Math.floor(Math.random()*10);
// $(".category").eq(random).click();


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
	}
];






