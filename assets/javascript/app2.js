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
  var tMinutesAway = 0;

  //clear form
  function clearForm(){
  	$("#train-name").val("");
	$("#destination").val("");
	$("#train-time").val("");
	$("#frequency").val("");

  }

$('#addTrain').on('click', function(){
	event.preventDefault();
	var trainName = $('#train-name').val().trim();
	var destination = $('#destination').val().trim();
	var firstTrainTime = $('#train-time').val().trim();
	var frequency = $('#frequency').val().trim();

	database.ref().push({
		name: trainName,
		destination: destination,
		firstTrainTime: firstTrainTime,
		frequency: frequency
	});

	clearForm();

});

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


database.ref().on("child_added", function(snapshot){
	$("#newTrain").append(`
		<tr>
		<td>${snapshot.val().name}</td>
		<td>${snapshot.val().destination}</td>
		<td>${snapshot.val().frequency}</td>
		<td>${calcNextTrain(snapshot.val().frequency,snapshot.val().firstTrainTime)[0]}</td>
		<td> ${calcNextTrain(snapshot.val().frequency, snapshot.val().firstTrainTime)[1]}</td>
		<td><button type="button" id="${snapshot.key}" class="btn btn-default edit-btn"></button></td>
		<td><button type="button" id="${snapshot.key}" class="btn btn-default delete-btn"></button></td>
		</tr>
		`);
	});

function deleteTrain(){
	if(confirm("Are you sure you want to delete this train?")){
		database.ref().child($(this).attr('id')).remove();
		$(this).closest('tr').remove();
	};
}

function editTrain(){

	var rowNum = $(this).parent().parent().index();
	var clickKey = $(this).attr('id');

	var query = database.ref().orderByKey();
	query.once("value")
	.then(function(snapshot){
		var snapObject = snapshot.val();
		snapshot.forEach(function(childSnapshot){
			var key= childSnapshot.key;
			var childData = childSnapshot.val();

			if(key === clickKey){
				$("#trainName").val(childData.name);
				$("#destination").val(childData.destination);
				$("#train-time").val(childData.starttime);
				$("#frequency").val(childData.frequency);
			}
		});
	});

database.ref().child($(this).attr('id')).remove();
	$(this).closest('tr').remove();
}

$(document).on("click", ".edit-btn", editTrain);
$(document).on("click", ".delete-btn", deleteTrain);


