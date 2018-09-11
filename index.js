// Initialize Cloud Firestore through Firebase
var dbFirestore = firebase.firestore();
var verCode = null;

window.onload = function() {

  if (firebase.auth().user){

    var user = firebase.auth().currentUser;
    var dispName = user.displayName;

  }else{
    handleSignedOutUser();
  }
};

// ON CHANGE LISTENER
firebase.auth().onAuthStateChanged(function(user) {

  // Check if user is present
  if (user) {
    if (user.email === 'aficionados2018@gmail.com')
    {
      window.location = "admin/admin.html";
    } else {
      window.location = "user/user.html";
    }
  }
});

//*********************************
//*********************************
// SIGN-IN USING FirebaseUI
//*********************************
//*********************************
/**
 * @return {!Object} The FirebaseUI config.
 */
function getUiConfig() {
  return {
    'callbacks': {
      // Called when the user has been successfully signed in.
      'signInSuccess': function(user, credential, redirectUrl) {
        handleSignedInUser(user);
        // Do not redirect.
        return false;
      }
    },
    // Opens IDP Providers sign-in flow in a popup.
    //signInSuccessUrl: 'user.html',
    'signInFlow': 'popup',
    'signInOptions': [
      // The Provider you need for your app. We need the Phone Auth
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    // 'tosUrl': 'https://www.google.com'
  };
}

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

/**
 * Displays the UI for a signed in user.
 * @param {!firebase.User} user
 */
var handleSignedInUser = function(user) {
  // Check if user is present
  if (user) {
    alert("USER SIGNED-IN");
    if (user.email === 'aficionados2018@gmail.com')
    {
      window.location = "admin/admin.html";
    } else {
      window.location = "user/user.html";
    }
  }
};


/**
 * Displays the UI for a signed out user.
 */
var handleSignedOutUser = function() {
  //document.getElementById('user-signed-in').style.display = 'none';
  document.getElementById("user-signed-out").style.display = "block";
  ui.start("#firebaseui-container", getUiConfig());
};

/**
 * Deletes the user's account.
 */
var deleteAccount = function() {
  firebase.auth().currentUser.delete().catch(function(error) {
    if (error.code == 'auth/requires-recent-login') {
      // The user's credential is too old. She needs to sign in again.
      firebase.auth().signOut().then(function() {
        // The timeout allows the message to be displayed after the UI has
        // changed to the signed out state.
        setTimeout(function() {
          alert('Please sign in again to delete your account.');
        }, 1);
      });
    }
  });
};

//*********************************
//*********************************
// END FUNCTION FirebaseUI
//*********************************
//*********************************

// SIGN-OUT
function signOut() {
  //document.getElementById("btnSignOut").style.display = "none";
  firebase.auth().signOut();
  alert("SIGNED OUT!");
}
