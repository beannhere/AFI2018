// ON CHANGE LISTENER
firebase.auth().onAuthStateChanged(function(user) {
if (user) {
  user.getIdToken(false).then(function(user) {
    console.log("ID token: " + user);

    // Get user values
    var user = firebase.auth().currentUser;
    var dispName = user.displayName;
    var photoURL = user.photoURL;

    console.log("Photo URL: " + photoURL);
    console.log("Name: " + dispName);
    console.log("Email: " + user.email);

  }).catch(function(error) {
    // Handle error
    console.log("No user ID TOKEN!!");
    });
  } else {
    // No user is signed in.
    //window.location = "/index.html";
    console.log("No user is signed in.");
  }
});

//==================================================================================================================
//==================================================================================================================
//==================================================================================================================
//==================================================================================================================
function tableList() {
  var table = document.getElementById("reqTable");
  table.innerHTML = "";
  console.log("LENGTH " + Object.keys(testDataList).length);
  for ( var key in testDataList) {
    listValue = testDataList[key];
    var row = table.insertRow(-1);
    for ( var key2 in listValue) {
        newValue = listValue[key2];
        var cell = row.insertCell(-1);
        cell.innerHTML = newValue;
      }
    var cell = row.insertCell(-1);
    cell.innerHTML =
      "<button id='popup-clickie' type='button' class='btn btn-primary' onClick='submitForm('submit')' style='text-align: center;'>UPLOAD SLIP</button>\n"
    + "<button onClick='submitForm('cancel')' type='button' class='btn btn-danger'>DEL</button>";
  }
  var header = table.createTHead();
  var row = header.insertRow(0);
  var cell = row.insertCell(-1);
  cell.innerHTML = "<b>COURT</b>";
  var cell = row.insertCell(-1);
  cell.innerHTML = "<b>DATE</b>";
  var cell = row.insertCell(-1);
  cell.innerHTML = "<b>TIME</b>";
  var cell = row.insertCell(-1);
  cell.innerHTML = "<b>STATUS</b>";
  var cell = row.insertCell(-1);
  cell.innerHTML = "<b>ACTIONS</b>";
}

function myFunction(item, index) {
  demoP.innerHTML = demoP.innerHTML + "index[" + index + "]: " + item + "<br>";
}

var dateToday = new Date();

$(function () {
  $('#datetimepicker1').datetimepicker({
    format: 'YYYY-MM-DD',
    minDate: dateToday
  });
});

function view(num){
  if (num === 'home'){
    document.getElementById(num).style.display = "block";
    document.getElementById('reqRes').style.display = "none";
    document.getElementById('reqList').style.display = "none";
  } else if (num === 'reqRes') {
    document.getElementById(num).style.display = "block";
    document.getElementById('home').style.display = "none";
    document.getElementById('reqList').style.display = "none";
  } else {
    document.getElementById(num).style.display = "block";
    document.getElementById('home').style.display = "none";
    document.getElementById('reqRes').style.display = "none";
    tableList();
  }
}

function submitForm(request) {
// Set form values
document.getElementById('court').value = "";
document.getElementById('date').value = "";
document.getElementById('time').value = "";

if (request === 'submit'){

  // Show pre form
  document.getElementById('popup-form').style.display = 'block';

  // Hide post form
  document.getElementById('post-form').style.display = "none";

  // Show and hide alert
  $('#success-alert').show();
  setTimeout(function () {
      $('#success-alert').fadeOut();
  }, 2000);
} else {


  // Show pre form
  document.getElementById('popup-form').style.display = 'block';
  // Hide post form
  document.getElementById('post-form').style.display = "none";
}
}

//function to hide Popup
function subReqForm(){
if(!validateForm()){
  alert ("Please fill out all fields")
} else {

    // Get form values
    var court = document.getElementById('court').value;
    var date = document.getElementById('date').value;
    var time = document.getElementById('time').value;

    // Hide reservation form
    document.getElementById('popup-form').style.display = "none";

    // Show post form
    document.getElementById('post-form').style.display = "block";
    document.getElementById('post-court').innerHTML = "Court: " + court;
    document.getElementById('post-date').innerHTML = "Date: " + date;
    document.getElementById('post-time').innerHTML = "Time: " + time;
  }
}

function validateForm(){
  // Get form values
  if (document.getElementById('court').value === ""){
    return false;
  } else if (document.getElementById('date').value === ""){
    return false;
  } else if (document.getElementById('time').value === ""){
    return false;
  } else {
    return true;
  }
}

// SIGN-OUT
function signOut() {
  firebase.auth().signOut();
  //alert("SIGNED OUT!");
  window.location = "index.html";
}
