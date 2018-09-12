// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCndVxiG7KVEKpJYfRN9kTo7cSqcvpGbfY",
    authDomain: "pinashoops-c535c.firebaseapp.com",
    databaseURL: "https://pinashoops-c535c.firebaseio.com",
    projectId: "pinashoops-c535c",
    storageBucket: "pinashoops-c535c.appspot.com",
    messagingSenderId: "762709182450"
};
firebase.initializeApp(config);
const settings = {timestampsInSnapshots: true};
var courtName = "";

/*================================================================================================*/
var fbase = firebase.firestore();
fbase.settings(settings);

firebase.auth().onAuthStateChanged(function(user) {	
	
  if (user) {
    loader = document.getElementById("loader");  
    loader.style.display = "block";      
    getRequestList();    
  } else {
    window.location = "../../index.html";
  }
});


var loader;


function getRequestList() {  
	var collection = fbase.collection('user');
	
	fbase.collection("user").get().then(function(querySnapshot) {		
		let container = document.querySelector('#tbody');		

	    querySnapshot.forEach(function(doc) {
	    	var rowUser, rowDate;
	    	var fullname = doc.data().fullname;
	    	var eid = doc.id;
	    	

	    	rowUser = document.createElement('tr');
	    	rowUser.className = "eid";
	    	rowUser.innerHTML = '<td colspan="4">'+ fullname +'</td>';	    	

	    	var dateList = collection.doc(doc.id).collection('requestList');
	    	
	    	dateList.get().then(function(querySnapshot) {		
	    		container.append(rowUser);
	    		querySnapshot.forEach(function(doc) {     
	    		var dID = doc.id;
					rowDate = document.createElement('tr'); 					
					rowDate.innerHTML = '<td class="text_center borderBottom">'+ doc.data().date +'</td>'
					+'<td class="text_center borderBottom	">'+ doc.data().courtID +'</td>';
					
					if(!doc.data().paymentFlg){
						rowDate.innerHTML += '<td class="text_center unpaid borderBottom">unpaid</td>';
						rowDate.innerHTML += '<td class="text_center borderBottom"></td>';
					} else {
						rowDate.innerHTML += '<td class="text_center paid borderBottom">paid</td>';
						
						if(doc.data().approvalFlg){
							rowDate.innerHTML += '<td class="action_td borderBottom"><a target="_blank" href="'+ doc.data().paymentURL +'" class="receipt_icon">View receipt</a><br/><span class="paid_icon apprv">APPROVED</span><br/></td>';
						} else {							
							if(doc.data().confirmationFlg){
								rowDate.innerHTML += '<td class="action_td borderBottom"><span title="Receipt has been verified internally" class="verified_icon verified">Receipt verified</span><br/><a target="_blank" href="'+ doc.data().paymentURL +'" class="receipt_icon">View receipt</a><br/><a id="'+eid+'_'+dID+'" onclick="return approve(this.id);" href="#" class="paid_icon forApprv">Approve</a><br/><a id="'+eid+'_'+dID+'" onclick="return reject(this.id);" href="#" class="down_icon forReject">Reject</a></td>';
							} else {
								rowDate.innerHTML += '<td class="action_td borderBottom"><span title="Please do manual verification" class="unverified_icon verified">Receipt unverified</span><br/><a target="_blank" href="'+ doc.data().paymentURL +'" class="receipt_icon">View receipt</a><br/><a id="'+eid+'_'+dID+'" onclick="return approve(this.id);" href="#" class="paid_icon forApprv">Approve</a><br/><a id="'+eid+'_'+dID+'" onclick="return reject(this.id);" href="#" class="down_icon forReject">Reject</a></td>';
							}
						}
					}				
					container.append(rowDate);
	    		});

	    	});
	        
	    });	    
		loader.style.display = "none";
	});
}

function getCourtID(){
	var courtCollection = fbase.collection('court_codes');		

	courtCollection.doc(doc.data().courtID).get().then(function(courtDoc) {		    				
		if(courtDoc.exists){
			rowDate = document.createElement('tr'); 					
			rowDate.innerHTML = '<td class="text_center">'+ doc.data().date +'</td>'
			+'<td class="text_center">'+ courtDoc.data().court +'</td>'	    			
			+'<td class="text_center">'+ doc.data().stat +'</td>'
			+'<td></td>';	 
			container.append(rowDate);	   						
		} 	
	});	  
}

function approve(elem){
	var collection = firebase.firestore().collection("user");
	var data = elem.split('_');
	var eID = data[0]
	var dID = data[1];

	collection.doc(eID).collection("requestList").doc(dID).update({
		approvalFlg: true
	}).then(function() {
		location.reload();
	});
}

function reject(elem){
	var userCollect = firebase.firestore().collection("user");
	var deletedCollect = firebase.firestore().collection("rejected");

	var data = elem.split('_');
	var eID = data[0]
	var dID = data[1];

	var rejectedData = {		
		date: dID
	};

	//userCollect.doc(eID).collection("requestList").doc(dID).delete().then(function() {
	    deletedCollect.doc(eID).set(rejectedData).then(function() {
    		location.reload();
    	});
	/*}).catch(function(error) {
	    console.error("Error removing document: ", error);
	});*/

}

// SIGN-OUT
function signOut() {
  	firebase.auth().signOut().then(function(){
  		window.location = "../../index.html";	
  	});   	
	
}
