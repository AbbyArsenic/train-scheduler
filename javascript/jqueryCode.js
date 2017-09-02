$(function() {
  console.log('running');
});

$( document ).ready(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDLWW13FMxDVzAxKJkgzK_fZJpszMsboR4",
    authDomain: "abbyproject-fc5a9.firebaseapp.com",
    databaseURL: "https://abbyproject-fc5a9.firebaseio.com",
    projectId: "abbyproject-fc5a9",
    storageBucket: "abbyproject-fc5a9.appspot.com",
    messagingSenderId: "1077332528836"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  //initial values
  var trainName = "";
  var destination = "";
  var platform = "";
  var frequency = "";
  var lineStart = "";

  //submit button logic
  $("#submit-train").on("click", function(event){
    event.preventDefault();
    //populate variables
    trainName = $("#nameInput").val().trim();
    destination = $("#destinationInput").val().trim();
    platform = $("#platformInput").val().trim();
    frequency = $("#freqInput").val().trim();
    lineStart = $("#startInput").val();

    //push train object to database
    var newTrain = {
      name: trainName,
      destination: destination,
      platform: platform,
      frequency: frequency,
      lineStart: lineStart
    };

    database.ref("Trains").push(newTrain);
  });

  database.ref("Trains").on("child_added", function(childSnapshot) {
    trainName = (childSnapshot.val().name);
    destination = (childSnapshot.val().destination);
    platform = (childSnapshot.val().platform);
    frequency = (childSnapshot.val().frequency);
    lineStart = (childSnapshot.val().lineStart);

  // determine next train
  var lineConverted = moment(lineStart, "HH:mm").subtract(1, "years");
  var diffTime = moment().diff(moment(lineConverted), "minutes");
  var tRemainder = diffTime % frequency;
  var untilNext = frequency - tRemainder;
  var nextTrain = moment().add(untilNext, "minutes");
  var nextTrainDisp = moment(nextTrain).format("hh:mm a");

  // clear input fields
  $("#nameInput").val('');
  $("#destinationInput").val('');
  $("#platformInput").val('');
  $("#freqInput").val('');
  $("#startInput").val('');

  // full list of items to the table
  $("#current-trains").append("<tr>" +
    "<td>" + (childSnapshot.val().name) + "</td>" + 
    "<td>" + (childSnapshot.val().destination) + "</td>" + 
    "<td>" + (childSnapshot.val().platform) + "</td>" +
    "<td>" + (childSnapshot.val().frequency) + "</td>" +
    "<td>" + nextTrainDisp + "</td>" + 
    "<td>" + untilNext + "</td></tr>");

  // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

  //Hogwarts Express Time
  var hogwartsStart = "1830/09/01 11:00";
  var hogwartsFormat = "YYYY/MM/DD HH:mm";
  var hogwartsConverted = moment(hogwartsStart, hogwartsFormat);
  var hogwartsDiff = moment().diff(moment(hogwartsConverted), "minutes");
  var hogwartsRemainder = hogwartsDiff % 525952.34;
  var hUntilNext = 525952.34 - hogwartsRemainder;
  var nextHogwartsTrain = moment().add(hUntilNext, "minutes");
  var nextHogwartsDisp = moment(nextHogwartsTrain).format("hh:mm a MMM DD, YYYY");
  console.log("Next train to Hogwarts departs at: " + nextHogwartsDisp);
  $("#hogwartsTime").html(Math.round(hUntilNext));
})
