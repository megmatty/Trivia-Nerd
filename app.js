var url = "https://opentdb.com/api.php?amount=10&type=multiple"; //gets mc questions

	var response; //holds response data
	var counter = 0; //counter for getting next question

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
$('#next').click(function(event) { //next button
	if (counter <=8) {
		counter = (counter + 1); //advance counter by 1
	} else if (counter >=9) {
		counter = 0; //reset counter
		$('#results').toggleClass('hide'); //hide question area
		$('#winner').toggleClass('hide'); //display win text
	}

	buildQuestion(counter);

}); //in final build, this should automatically advance without button


//Answer button handler
$('.answer-buttons').click(function(event) {
	var correctAnswer = response.results[counter].correct_answer; //gets correct answer value from object
	$('#correct-holder').html(correctAnswer); //converts unicode to html in hidden div
	var realAnswer = $('#correct-holder').text(); //gets the text inside the hidden div
	if ( $(this).text() == realAnswer ) { //compares text of button with text of realAnswer
		$('#correct').text('You are right!');
	} else {
		$('#correct').html(' No, the answer is ' + response.results[counter].correct_answer);
	}
	//probably needs its own function to check answers, how to get "this"??
});


//Random number generator for multiple choice answers - thanks stackoverflow!
	var uniqueRandoms = []; //empty array
	var numRandoms = 4; //how many numbers do you want (1-4)

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

// $('button').click(function(event) {
// 	$('#example').load('example.html');
// });

$('#category-1').on('click', function(event) {
	url = url + "&category=9";
	$.getJSON(url, getQuestions);
});



//make simple object to match category name to the category id from OTDB
//click handler for "this" button that pulls from that object by matching the text










