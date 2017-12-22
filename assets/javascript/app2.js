



var config = {
    apiKey: "AIzaSyBFe5pf-EIoVc2Q8DM1Bp07-k6wAY0FqTA",
    authDomain: "train-scheduler-bec06.firebaseapp.com",
    databaseURL: "https://train-scheduler-bec06.firebaseio.com",
    storageBucket: "train-scheduler-bec06.appspot.com",
    messagingSenderId: "539406827719"
  };

  firebase.initializeApp(config);

//variables
  var database = firebase.database();
  var nextTrain = 0;
  var minutesAway = "";
  var trainID = [];
  var index = 0;
  var nameOfTrain = "";
  
  // var currentTime = moment().format('dddd, MMMM Do YYYY, h:mm:ss A');
	// $('#current-status').html( currentTime);

	var nextTrain = 0;

  var nameOfTrain = "";
  var destination = "";
  var firstTrainTime = "";
  var frequency = 0;

  var datetime = null,
date = null;

var update = function () {
  date = moment(new Date())
  datetime.html(date.format('MMMM Do YYYY, h:mm:ss a'));
};

$(document).ready(function(){
  datetime = $('#current-status')
  update();
  setInterval(update, 1000);
});
 
 


// var datetime = null,

// var date = null;

// var update = function () {
//   date = moment(new Date())
//   datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss A'));
// };




$(document).ready(function(){

$('#refresh').on('click', function(){
	location.reload();
	console.log('clicked');



 
});

//add new train button/inputs data from user
$("#addTrain").on("click", function(event){
	event.preventDefault();

	 nameOfTrain = $('#train-name').val().trim();
	destination = $('#destination').val().trim();
	firstTrainTime = $('#first-train').val().trim();
	 frequency = $('#frequency').val().trim();



	database.ref().push({
		nameOfTrain: nameOfTrain,
		destination: destination,
		firstTrainTime: firstTrainTime,
		frequency: frequency,
		 minutesAway: minutesAway,
		 nextArrival: nextArrival,

		dateAdded: firebase.database.ServerValue.TIMESTAMP
		
	});

	console.log("submitted");

	//clear all boxes

	$("#train-name").val("");
	$("#destination").val("");
	$("#first-train").val("");
	$("#frequency").val("");


	return false;


});

var updatedNextArrival = function(){
		date = moment(new Date())
		dateTime.html(date.format('hh:mm a'));

			
	}

//create firebase event for adding a train to the database
database.ref().orderByChild("dateAdded").limitToLast(20).on("child_added", function(childSnapshot){

	console.log(childSnapshot.val());

	var trainName = childSnapshot.val().nameOfTrain;
	var trainDestination = childSnapshot.val().destination;
	var firstTrainTime = childSnapshot.val().start;
	var trainFrequency = childSnapshot.val().frequency;

	var trainFrequency;

	var firstTrainTime = 0;

	var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
	console.log(moment("FTC: " + firstTimeConverted));



	var differentTime = moment().diff(moment(firstTimeConverted), "minutes");
	console.log("difference in time: " + differentTime);

	var timeRemaining = differentTime % trainFrequency;
	console.log(timeRemaining);

	var minutesAway = trainFrequency - timeRemaining;
	console.log("minutes until train:" + minutesAway);

	var nextTrain = moment().add(minutesAway, "minutes");
	console.log("arrival time: " + moment(nextTrain).format("hh:mm"));


	var nextArrival = moment(nextTrain).format("hh:mm a");

	// var nextArrivalUpdate = function() {
 //    date = moment(new Date())
 //    datetime.html(date.format('hh:mm a'));
 //  }


// database.ref().orderByChild("dateAdded").limitToLast(20).on("child_added", function(snapshot){


console.log("Train name: " + childSnapshot.val().nameOfTrain);
	console.log("Destination: " + childSnapshot.val().destination);
	console.log("First train: " + childSnapshot.val().firstTrainTime);
	console.log("Frequency: " + childSnapshot.val().frequency);
	console.log("Next train: " + childSnapshot.val().nextArrival);
	console.log("Minutes away: " + childSnapshot.val().minutesAway);
	console.log("difference in time: " + childSnapshot.val().differentTime);
	// console.log("FTC: " + childSnapshot.val().firstTimeConverted);
	

	console.log("===========================================");





	$("#newTrain").append("<tr><td>" + childSnapshot.val().nameOfTrain + "</td>" 
		+ "<td>" + childSnapshot.val().destination + "</td>" 
		+ "<td>" + "Every " + childSnapshot.val().frequency + "  mins" + "</td>" 
		+ "<td>" + nextArrival + "</td>" 
		+ "<td>" + minutesAway + " mins until arrival" 
		+ "<td><button class='delete btn btn-default btn-sm' data-index='" + index 
		+ "</button> " + "</td>" +
   		"<td>" + "<button type='button' class='btn btn-default btn-sm'>"  + "</button>" +

		"</td></tr>");

	index++;

}, function(errorObject){
	console.log("Errors handled: " + errorObject.code);
});

database.ref().once('value', function(dataSnapshot){
	var indexTrain = 0;

	dataSnapshot.forEach(
		function(childSnapshot){
			trainID[indexTrain++] = childSnapshot.key;
		})
		});
		
		


	console.log(trainID);


});
















 