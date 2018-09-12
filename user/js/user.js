// ON CHANGE LISTENER
var loader;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {    
          
    // Get user values
    var dispName = user.displayName;
    var photoURL = user.photoURL;

    console.log("Photo URL: " + photoURL);
    console.log(user);  
    console.log("Name: " + dispName);
    console.log("Email: " + user.email);
  }else {
    window.location = "/index.html";
  }
});

//==================================================================================================================
//==================================================================================================================
//==================================================================================================================
//==================================================================================================================
function tableList() {
  loader = document.getElementById("loader"); 
  loader.style.display = "block";
  
  var table = document.getElementById("reqTable");
  table.innerHTML = "";
  var date = "";

  var email = firebase.auth().currentUser.email;
  var userName = email.substring(0, email.indexOf('@gmail.com'));
  firebase.firestore().collection("user").doc(userName).collection("requestList").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      console.log("Firestore DATE: ", doc.data().date);

      // date = doc.data().date;
      // var dateId = date.replace(/-/g , "");
      // console.log("Firestore dateId: ", dateId);
      // console.log("Firestore DATE: ", doc.data().date);

      var row = table.insertRow(-1);
      row.setAttribute("id", "row_" + doc.id);

      var cell = row.insertCell(-1);
      cell.innerHTML = doc.data().courtID;

      var cell = row.insertCell(-1);
      cell.innerHTML = doc.data().date;      

      var cell = row.insertCell(-1);
      cell.innerHTML = doc.data().time;

      var cell = row.insertCell(-1);
      cell.innerHTML = doc.data().stat;

      if(doc.data().stat != "for approval"){
        var cell = row.insertCell(-1);
        cell.innerHTML =
        "<form >"
      + " <div class='form-group'>"
      + "  <button id='btnGroup_" + doc.id +"' onClick='deleteRequest("+doc.id+")' type='button' class='btn btn-danger'>DELETE</button><br>"
      + "  <input type='file' class='form-control-file' id='fileBtn_" + doc.id +"'>"
      + " </div>"
      + "</form>\n"
      + "<div class='progress' id='progress_" + doc.id + "' style='margin: auto; left: 0; width:80%; text-align: center'>"
      + " <div id='theprogressbar_" + doc.id + "' class='progress-bar progress-bar-striped active' role='progressbar'"
      + "  aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width:0%'>"
      + "  0%"
      + " </div>"
      + "</div>"

      callWindowLoad("fileBtn_" + doc.id, doc.id);  
      } else {
        var cell = row.insertCell(-1);
      }
    });
    setTimeout(function() {
          loader.style.display = "none";
    }, 180);  
  });

  // console.log("LENGTH " + Object.keys(testDataList).length);
  // for ( var key in testDataList) {
  //   listValue = testDataList[key];
  //   var row = table.insertRow(-1);
  //   for ( var key2 in listValue) {
  //       newValue = listValue[key2];

  //       var parseDate = parseInt(newValue);

  //       if (parseDate.toString().length == 8){
  //         date = parseDate;
  //         console.log("DATE: " + date);
  //       }

  //       var cell = row.insertCell(-1);
  //       cell.innerHTML = newValue;
  //     }
  //   var cell = row.insertCell(-1);
  //   cell.innerHTML =
  //     "<form>"
  //   + " <div class='form-group'>"
  //   + "  <button onClick='submitForm('cancel')' type='button' class='btn btn-danger'>DELETE</button><br>"
  //   + "  <input type='file' class='form-control-file' id='fileBtn_" + date +"'>"
  //   + " </div>"
  //   + "</form>\n"
  //   + "<div class='progress' id='progress_" + date + "' style='margin: auto; left: 0; width:80%; text-align: center'>"
  //   + " <div id='theprogressbar_" + date + "' class='progress-bar progress-bar-striped active' role='progressbar'"
  //   + "  aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width:0%'>"
  //   + "  0%"
  //   + " </div>"
  //   + "</div>"

  //  callWindowLoad("fileBtn_" + date, date);
  // }
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
  cell.innerHTML = "<b>ACTIONS</b>";firebase.auth().currentUser
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
    //document.getElementById(num).style.display = "block";
    document.getElementById('reqRes').style.display = "none";
    document.getElementById('reqList').style.display = "none";
  } else if (num === 'reqRes') {
    document.getElementById(num).style.display = "block"; 
    document.getElementById('regist01').style.display = "block";     
    //document.getElementById('home').style.display = "none";
    document.getElementById('reqList').style.display = "none";
    // RESET
    document.getElementById('court').value == "";
    document.getElementById('date').value == "";
    document.getElementById('time').value == "";
  } else {    
    document.getElementById(num).style.display = "block";
    //document.getElementById('home').style.display = "none";
    document.getElementById('reqRes').style.display = "none";
    tableList();
  }
}

function submitForm(request) {
// // Set form values
// document.getElementById('court').value = "";
// document.getElementById('date').value = "";
// document.getElementById('time').value = "";

//************************** */
var email = firebase.auth().currentUser.email;
var userName = email.substring(0, email.indexOf('@gmail.com'));
var docRef = firebase.firestore().collection("user").doc(userName);

var inputcontact = document.getElementById('contact').value;
var court = document.getElementById('court').value;
var date = document.getElementById('date').value;
var time = document.getElementById('time').value;

// var getDoc = docRef.get()
// .then(doc => {
//   alert(doc.exists);
//     if (doc.exists) {  
        // console.log('No such document!');
        // console.log("awda");
        // console.log(firebase.auth().currentUser.displayName);
        // var userdata = {       
        //   fullname: firebase.auth().currentUser.displayName,  
        //   contact: inputcontact
        // };
        
        // var dateId = date.replace(/-/g , "");
        // var selectedCourt = document.getElementById("court");
        // var courtname = selectedCourt.options[selectedCourt.selectedIndex].text;
        // var selectedTime = document.getElementById("time");
        // var inputTime = selectedTime.options[selectedTime.selectedIndex].text;

        // firebase.firestore().collection("user").doc(userName).set(userdata).then(result => {
        //   console.log('setting data for request list ');
        //   var updateData = {
        //     approvalFlg: false,
        //     confirmationFlg: false,
        //     courtID: courtname,
        //     date: date,
        //     paymentFlg: false,
        //     paymentURL: "",
        //     time: inputTime,
        //     stat: "pending"
        //   };
        //   firebase.firestore().collection("user").doc(userName).collection("requestList").doc(dateId).set(updateData);
        // });

//     } else {
//         console.log('Document data:', doc.data());
//     }
// })
// .catch(err => {
//     console.log('Error getting document', err);
// });


//*********************************************** */

if (request === 'submit'){
  console.log(firebase.auth().currentUser.displayName);
  var userdata = {       
    fullname: firebase.auth().currentUser.displayName,  
    contact: inputcontact
  };
  
  var dateId = date.replace(/-/g , "");
  var selectedCourt = document.getElementById("court");
  var courtname = selectedCourt.options[selectedCourt.selectedIndex].text;
  var selectedTime = document.getElementById("time");
  var inputTime = selectedTime.options[selectedTime.selectedIndex].text;

  firebase.firestore().collection("user").doc(userName).set(userdata).then(result => {
    console.log('setting data for request list ');
    var updateData = {
      approvalFlg: false,
      confirmationFlg: false,
      courtID: courtname,
      date: date,
      paymentFlg: false,
      paymentURL: "",
      time: inputTime,
      stat: "pending"
    };
    firebase.firestore().collection("user").doc(userName).collection("requestList").doc(dateId).set(updateData)
    .then(function(){
      $('#success-alert').show();
      setTimeout(function () {      
        $('#success-alert').fadeOut();
    }, 2000);

    }).catch(function(error) {
      console.error("Error removing document: ", error);
      $('#success-failed').show();
      setTimeout(function () {      
        $('#success-failed').fadeOut();
      }, 2000);
    });
  });

  // Show pre form
  document.getElementById('popup-form').style.display = 'block';
  document.getElementById('regist01').style.display = 'block';

  // Hide post form
  document.getElementById('post-form').style.display = "none";
  document.getElementById('court').value = '';
  document.getElementById('date').value = '';
  document.getElementById('time').value = '';
  document.getElementById('contact').value = '';
  //alert(document.getElementById('contact'));

  // // Show and hide alert
  // $('#success-alert').show();
  //   setTimeout(function () {      
  //     $('#success-alert').fadeOut();
  // }, 2000);
  } else {

    // Show pre form
    document.getElementById('popup-form').style.display = 'block';
    document.getElementById('regist01').style.display = "block";

    // Hide post form
    document.getElementById('post-form').style.display = "none";    

    document.getElementById('court').value = '';
    document.getElementById('date').value = '';
    document.getElementById('time').value = '';
    document.getElementById('contact').value = '';
  }
}

function deleteRequest(dateId){

  var email = firebase.auth().currentUser.email;
  var userName = email.substring(0, email.indexOf('@gmail.com'));

  console.log("DATE: " + dateId);

  //var dateId = date.replace(row , "");

  firebase.firestore().collection("user").doc(userName).collection("requestList").doc(dateId.toString()).delete().then(function() {
    console.log("Document successfully deleted!");
    var row = document.getElementById('row_' + dateId.toString());
	  row.parentNode.removeChild(row);
  }).catch(function(error) {
      console.error("Error removing document: ", error);
  });


}

//function to hide Popup
function subReqForm(){      
if(isEmpty()){
  alert ("Please fill out all fields");
  view('reqRes');
} else {
  isDateReserved();
}
}

function isEmpty(){
  // Get form values
  if (document.getElementById('court').value === ""){
    return true;
  } else if (document.getElementById('date').value === ""){
    return true;
  } else if (document.getElementById('time').value === ""){
    return true;
  } else if (document.getElementById('contact').value === ""){
    return true;
  } else {
    return false;
  }
}

/**
 * Check if date is already reserved.
 */
function isDateReserved(){
  var user = firebase.auth().currentUser;
  var email = user.email;
  var eid = email.substring(0, email.indexOf('@gmail.com'));
  var inputDate = document.getElementById('date').value;
  var inputId = inputDate.replace(/-/g , "");  
  //var docRef = firebase.firestore().collection("user").doc(eid);  
  
  firebase.firestore().collection("user").doc(eid).get().then(doc => {            
    console.log("Doc exists?  "+doc.exists);
      if (doc.exists) {
        console.log("to check"+inputId);        
        firebase.firestore().collection("user").doc(eid).collection("requestList").doc(inputId).get().then(data => {              
          if (data.exists) {
            alert('Please select other date.');
          } else {              
               // Get form values
              var court = document.getElementById('court').value;
              var date = document.getElementById('date').value;
              var time = document.getElementById('time').value;
              // var contact = document.getElementById('contact').value;

              // Hide reservation form
              document.getElementById('popup-form').style.display = "none";
              document.getElementById('regist01').style.display = "none";

              // Show post form
              document.getElementById('post-form').style.display = "block";
              document.getElementById('post-court').innerHTML = "Court: " + court;
              document.getElementById('post-date').innerHTML = "Date: " + date;
              document.getElementById('post-time').innerHTML = "Time: " + time;              
          }
        });
      } else {
        var court = document.getElementById('court').value;
        var date = document.getElementById('date').value;
        var time = document.getElementById('time').value;
        var contact = document.getElementById('contact').value;

        // Hide reservation form
        document.getElementById('popup-form').style.display = "none";
        document.getElementById('regist01').style.display = "none";        

        // Show post form
        document.getElementById('post-form').style.display = "block";
        document.getElementById('post-court').innerHTML = "Court: " + court;
        document.getElementById('post-date').innerHTML = "Date: " + date;
        document.getElementById('post-time').innerHTML = "Time: " + time;
        
      }
  }).catch(err => {
      console.log('Error getting document', err);
  });
}
// SIGN-OUT
function signOut() {
  firebase.auth().signOut();
  //alert("SIGNED OUT!");
  window.location = "index.html";
}

// Download file from Firebase Storage
function getStorageFile(fileName) {
  // Create a reference to the file we want to download
  //var fileName = document.getElementById("downloadFile").value;
  console.log("Filename: " + fileName);
  var starsRef = firebase.storage().ref(fileName);

  // Get the download URL
  starsRef.getDownloadURL().then(function(url) {

    console.log("URL: " + url);

    // Put link to download the file
    //document.getElementById('linkbox').innerHTML = '<a href="' +  url + '">Click For File</a>';

  }).catch(function(error) {

    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/object_not_found':
        // File doesn't exist
        console.log("File doesn't exist");
        break;

      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        console.log("User doesn't have permission to access the object");
        break;

      case 'storage/canceled':
        // User canceled the upload
        console.log("User canceled the upload");
        break;

      case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        console.log("Unknown error occurred, inspect the server response");
        break;
    }
  });
}

// Upload file to Firebase storage
function callWindowLoad(fileBtnId, date){

  console.log("HELLO WORLD");

  var storageRef = '';

  // window.onload = function() {

    // Get file from html
    var fileButton = document.getElementById(fileBtnId);

    fileButton.addEventListener("change",function(e){
      console.log("***fileButton value***" + fileButton.value);

      var ext=fileButton.value.split(".");
      ext = ext[ext.length - 1]
      console.log("***fileButton value2***" + ext);

      if (ext === 'png' || ext === 'PNG'){

      // Get user values
      var currUser = firebase.auth().currentUser;
      var date=fileButton.id.split("_")[1];

      // Get file
      var file = e.target.files[0];

      var fileName = currUser.uid + "_" + date + "." + ext;

      // Create storage ref
      storageRef = firebase.storage().ref(fileName);

      // Upload file
      var task = storageRef.put(file);

      // Update progress bar
      task.on('state_changed',

      function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');

        // For progress bar
        document.getElementById("theprogressbar_" + date).setAttribute("aria-valuenow", progress);
        document.getElementById("theprogressbar_" + date).innerHTML = progress + "%";
        document.getElementById("theprogressbar_" + date).style.width = progress + "%";

        // Check snapshot state
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
          }
        }, function(error) {
          alert("UPLOADING FAILED");

          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
            // User doesn't have permission to access the object
            console.log("User doesn't have permission to access the object");
            break;

            case 'storage/canceled':
            // User canceled the upload
            console.log("User canceled the upload");
            break;

            case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            console.log("Unknown error occurred, inspect error.serverResponse");
            break;
          }
        }, function() {
          // Upload completed successfully, now we can get the download URL
          //alert("Upload completed");
          console.log("fileName: " + fileName);          
          getStorageFile(fileName);          
          var downloadURL = task.snapshot.downloadURL;
          // Unknown error occurred, inspect error.serverResponse

          var collection = firebase.firestore().collection("user").doc()

          var email = firebase.auth().currentUser.email;
          var userName = email.substring(0, email.indexOf('@gmail.com'));
          
          firebase.firestore().collection("user").doc(userName).collection("requestList").doc(date).update({
            stat: "for approval"
          }).then(function(){
            //location.reload();
            view('reqList');            
          });


          console.log("DOWNLOAD URL: " + downloadURL);
        });
      }
    });
  // };
}

window.onload = function() {
  view('home');

  // Add court options to select
  dbFirestore.collection("court_codes").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      console.log("Firestore court: ", doc.data().court);

      var selectGroup = document.getElementById("court");
      var option = document.createElement("option");
      option.value = doc.data().court;
      option.text = doc.data().court;
      selectGroup.add(option);
    });
  });

  // Add time options to select
  dbFirestore.collection("court_sched_times").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      console.log("Firestore time: ", doc.data().time);

      var selectGroup = document.getElementById("time");
      var option = document.createElement("option");
      option.value = doc.data().time;
      option.text = doc.data().time;
      selectGroup.add(option);
    });
  });
}