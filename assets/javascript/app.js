// Initialize Firebase
var config = {
  apiKey: "AIzaSyB-IEtMF8160wazap0oJWKjz0xpXwg2pAY",
  authDomain: "train-scheduler-b4ad5.firebaseapp.com",
  databaseURL: "https://train-scheduler-b4ad5.firebaseio.com",
  projectId: "train-scheduler-b4ad5",
  storageBucket: "",
  messagingSenderId: "498738448448"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTime = moment($("#first-train-input").val().trim(), "Min").format("hh:mm");
  var frequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data to push to firebase
  var newTrain = {
    trainName: trainName,
    destination: destination,
    firstTime: firstTime,
    frequency: frequency
  };

  //push train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.trainName);
  console.log(newTrain.destination);
  console.log(newTrain.firstTime);
  console.log(newTrain.frequency);

  // // Alert
  // alert("train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");

});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // assign firebase variables to snapshots.
  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var firstTime = childSnapshot.val().firstTime;
  var frequency = childSnapshot.val().frequency;

  // train Info
  console.log("trainName* = " + trainName);
  console.log("destination* = " + destination);
  console.log("firstTime* = " + firstTime);
  console.log("frequency* = " + frequency);


  // Calculate the Next Arrival and Minutes Away using math
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log("First Time " + firstTimeConverted.format("hh:mm"));

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + moment(diffTime).format("hh:mm"));

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log("REMAINDER " + tRemainder);

    // Minute Until Train
    var minutesAway = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);

    // Next Train
    var nextArrival = moment().add(minutesAway, "minutes");
    nextArrival = moment(nextArrival).format("hh:mm A");
    console.log("ARRIVAL TIME: " + nextArrival);


console.log('----------------------------------------------------------------------------------------------');

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" +
    trainName + "</td><td>" +
    destination + "</td><td>" +
    frequency + "</td><td>" +
    nextArrival + "</td><td>" +
    minutesAway + "</td></tr>");
});
