//iniatlize firebase


var config = {
    apiKey: "AIzaSyBFe5pf-EIoVc2Q8DM1Bp07-k6wAY0FqTA",
    authDomain: "train-scheduler-bec06.firebaseapp.com",
    databaseURL: "https://train-scheduler-bec06.firebaseio.com",
    storageBucket: "train-scheduler-bec06.appspot.com",
    messagingSenderId: "539406827719"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  var nextTrain = 0;
  var minsAway =
  var nameOfTrain = "";
  var destination = "";
  var firstTrainTime = "";
  var frequency = 0;
  var currentTime = moment();
  var index = 0;
  var trainID = [];

  var dateTime = null,
  date= null;


  var update = function(){
  	date = moment(new Date())
  	dateTime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
  };


$(document).ready(function(){

	$('#refresh').on('click', function(){
	location.reload();
	console.log('clicked');
})
	dateTime = $('#current-status')
	update();
	setInterval(update, 1000);
});




$('#addTrain').on('click', function(){


	nameOfTrain = $('#train-name').val().trim();
	destination = $('#destination').val().trim();
	firstTrainTime = $('#train-time').val().trim();
	frequency = $('#frequency').val().trim();

	 var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
	console.log("FTC: " + firstTimeConverted);

	var differentTime = moment().diff(moment(firstTimeConverted), "minutes");
	console.log("difference in time: " + differentTime);

	var timeRemaining = differentTime % frequency;
	console.log(timeRemaining);

	var minutesLeft = frequency - timeRemaining;
	console.log("Mintues away: " + minutesLeft);

	var nextTrain = moment().add(minutesLeft, "minutes");
	console.log("Arrival time: " + moment(nextTrain).format("hh:mm"));

	var nextArrival = moment(nextTrain).format("hh:mm a");

	
	  // var timeArr = tFirstTrain.split(":");
   //    var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
   //    var maxMoment = moment.max(moment(), trainTime);
	// console.log("minutes away: " + minsAway);


//calculate next time arrival

	var updatedNextArrival = function(){
		date = moment(new Date())
		dateTime.html(date.format('hh:mm a'));

			
	}

	function calcNextTrain(p1, p2){
	var frequency = p1;
	var firstTime = p2;


	var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");

	var currentTime = moment();

	var differentTime = moment().diff(moment(firstTimeConverted), "minutes");

	var timeRemaining = differentTime % frequency;

	tMinutesAway = frequency - timeRemaining;

	nextTrain = moment().add(tMinutesAway, "minutes");
	nextTrain = moment(nextTrain).format("hh:mm A");

	return [nextTrain, tMinutesAway];
};



	database.ref().push({
		nameOfTrain: nameOfTrain,
		destination: destination,
		firstTrainTime: firstTrainTime,
		frequency: frequency,
		minutesLeft: minutesLeft,
		nextArrival: nextArrival,
		starttime: firstTrainTime,


		dateAdded: firebase.database.ServerValue.TIMESTAMP
		
	});

	console.log("submitted");

	$("#train-name").val("");
	$("#destination").val("");
	$("#train-time").val("");
	$("#frequency").val("");


	return false;


});

//calculat next train

// database.ref().on("child_added", function(snapshot){
// 	$("#newTrain").append(`
// 		<tr>
// 		<td>${snapshot.val().name}</td>
// 		<td>${snapshot.val().destination}</td>
// 		<td>${snapshot.val().frequency}</td>
// 		<td>${calcNextTrain(snapshot.val().frequency,snapshot.val().firstTrainTime)[0]}</td>
// 		<td> ${calcNextTrain(snapshot.val().frequency, snapshot.val().firstTrainTime)[1]}</td>
// 		<td><button type="button" id="${snapshot.key}" class="btn btn-default edit-btn"></button></td>
// 		<td><button type="button" id="${snapshot.key}" class="btn btn-default delete-btn"></button></td>
// 		</tr>
// 		`);
// 	});

database.ref().orderByChild("dateAdded").limitToLast(20).on("child_added", function(snapshot){

	console.log("Train name: " + snapshot.val().nameOfTrain);
	console.log("Destination: " + snapshot.val().destination);
	console.log("First train: " + snapshot.val().firstTrainTime);
	console.log("Frequency: " + snapshot.val().frequency);
	console.log("Next train: " + snapshot.val().nextArrival);
	console.log("Minutes away: " + snapshot.val().minutesLeft);

	console.log("===========================================");
	// console.log(moment());
	




	// const currentDiff = moment().diff(parseInt(snapshot.val().firstTrainTime));
	// let finalDiff = currentDiff % moment(parseInt(snapshot.val().frequency));
	// console.log(finalDiff);
	// console.log(snapshot.val().frequency);
	// console.log(moment().minutes());
	
	//change HTML
	//TODO: update the next arrival time
	$("#newTrain").append("<tr><td>" + snapshot.val().nameOfTrain + "</td>" 
		+ "<td>" + snapshot.val().destination + "</td>" 
		+ "<td>" + "Every " + snapshot.val().frequency + "  mins" + "</td>" 
		+ "<td>" + snapshot.val().nextArrival + "</td>" 
		+ "<td>" + snapshot.val().minutesLeft + " mins until arrival" 
		+ "<td>" + calcNextTrain(snapshot.val().frequency,snapshot.val().firstTrainTime)[0] + "</td>"
		+ "<td>" + calcNextTrain(snapshot.val().frequency, snapshot.val().firstTrainTime)[1] + "</td>" + "</td></tr>");

	index++;

}, function(errorObject){
	console.log("Errors handled: " + errorObject.code);
});

//train ID in its array
database.ref().once('value', function(dataSnapshot){
	var indexTrain = 0;

	dataSnapshot.forEach(
		function(childSnapshot){
			trainID[indexTrain++] = childSnapshot.key();
		})
		});
		
		


	console.log(trainID);





