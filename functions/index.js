// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firebase Realtime Database
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

//const gcs = require('@google-cloud/storage')({keyFilename: "./pinashoops2018-firebase-adminsdk-6fm75-af6da71d3f.json"});
// Other method
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

//https://myaccount.google.com/lesssecureapps?pli=1

// Initialize app
admin.initializeApp();

// TEST FOR MY CLIENT WEB APP
// firebase.database().ref("SLEL/EL/LGTM/content").set({
//   date_filed: 'Fri Aug 03 17:28:12 GMT+08:00 2018',
//   date_from: '08/03/2018',
//   date_to: '08/03/2018',
//   name: 'Francis',
//   reason: 'Fever',
//   ref_num: '7777777',
//   team: 'LGTM',
//   type: 'EL'
// }).then(function() {
//   console.log("DB SUCCESS");
// }).catch(function(error) {
//   console.log("DB ERROR " + error);
// });

// // Setup Variables
const APP_NAME = 'PINOY_HOOPS';
var email = '';
var content = '';
// Variable from CLI
//firebase functions:config:set gmail.email=aficionados2018@gmail.com gmail.password=afiadmin2018
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
// Setup email account
const mailTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
	user: gmailEmail,
	pass: gmailPassword
  }
});

// Cloud storage trigger
exports.generateThumbnail = functions.storage.object().onFinalize((object) => {

 console.log('Storage bucket ' + object.bucket);
 console.log('Storage name ' + object.name);
 console.log('Storage contentType ' + object.contentType);
 console.log('Storage resourceState ' + object.resourceState);
 console.log('Storage metageneration ' + object.metageneration);

 const fileBucket = object.bucket; // The Storage bucket that contains the file.
 const filePath = object.name; // File path in the bucket.
 const contentType = object.contentType; // File content type.
 const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

 var uid=object.name.split("_")[0];
 var date=object.name.split("_")[1].split(".")[0];

 console.log('uid value ' + uid);
 console.log('date value ' + date);

//  // Get the file name.
// const fileName = path.basename(filePath);
// // Exit if the image is already a thumbnail.
//
//
//   // [START thumbnailGeneration]
//   // Download file from bucket.
//   const bucket = gcs.bucket(fileBucket);
//   const tempFilePath = path.join(os.tmpdir(), filePath);
//   const metadata = {
//     contentType: contentType,
//   };
//
//   console.log('Storage gcs bucket ' + bucket);
//   console.log('Storage gcs tempFilePath ' + tempFilePath);
//   console.log('Storage metadata ' + metadata);
//
//   const file = bucket.file(fileName);
//   file.getSignedUrl({
//     action: 'read'
//   }).then(signedUrls => {
//      console.log("BUCKET URL: " + signedUrls[0]);
//   });

  const img_url = `https://firebasestorage.googleapis.com/v0/b/${fileBucket}/o/`
+ encodeURIComponent(filePath)
+ `?alt=media&token=`
+ object.metadata.firebaseStorageDownloadTokens;

console.log('IMAGE URL :',img_url);

  //You may return a promise
  return admin.auth().getUser(uid)
    .then(function(userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      var user=userRecord.email.split("@")[0];
      console.log('USER VALUE: ' + user);
      return detectTextGCS(fileBucket, filePath).then((bool)=> {
        console.log('BOOL VALUE: ' + bool);
        sendEmailToAdmin(userRecord, img_url, bool);
        return admin.firestore().collection('user')
         .doc(user)
         .collection('requestList')
         .doc(date)
          .update({
            confirmationFlg: bool,
            paymentFlg: true,
            paymentURL: img_url
          }).then(()=> {
            console.log("User updates successfully");
          }).catch(function(error) {
            console.log("Error updating user data:", error);
          });
      });
    })
    .catch(function(error) {
      console.log("Error fetching user data:", error);
    });
});

// Sends an e-mail to admin
function sendEmailToAdmin(userRecord, img_url, bool){

  var not = ' NOT';
  if (bool){
    not = '';
  }
  // Construct email
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: gmailEmail
  };

  mailOptions.subject = `[${APP_NAME}] Request submitted`;
  mailOptions.text =
    `Hi there,\n\n`
  + `Please be informed that ${userRecord.displayName} has deposited the payment and cloud vision has detected that the slip is${not} valid.\n\n`
  + `You may verify the image link below:\n`
  + `${img_url}.\n\n`
  + `Should you have any questions, do reach out to ${userRecord.displayName} @ ${userRecord.email}.\n\n`
  + `Sincerely,\n`
  + `Automated-Pinoy-Hoops-Email`

  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('Email sent')
    return sendEmailToUser(userRecord);
    // // FCM
    // // The topic name can be optionally prefixed with "/topics/".
    // var topic = 'automated_slel';
    //
    // // See documentation on defining a message payload.
    // var message = {
    // data: {
    //   email: email,
    //   type: content.type,
    //   team: content.team,
    //   name: content.name,
    //   ref_num: content.ref_num,
    //   reason: content.reason,
    //   date_from: content.date_from,
    //   date_to: content.date_to
    // },
    // topic: topic
    // };
    //
    // // Send a message to devices subscribed to the provided topic.
    // return admin.messaging().send(message)
    //   .then((response) => {
    //     // Response is a message ID string.
    //     console.log('New welcome email sent to:', email);
    //     console.log('FCM Successfully sent message:', response);
    //   })
    //   .catch((error) => {
    //     console.log('FCM Error sending message:', error);
    //   });
    //
    // //return console.log('New welcome email sent to:', email);
  });
}

// Sends an e-mail to user
function sendEmailToUser(userRecord){

  // Construct email
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: userRecord.email
  };

  mailOptions.subject = `[${APP_NAME}] Request submitted`;
  mailOptions.text =
    `Hi there,\n\n`
  + `Thank you for depositing 50% of the total payment, your slip will be reviewed within 24hrs and will verify you if approved or rejected.\n\n`
  + `Should you have any questions, do reach out to ${gmailEmail}.\n\n`
  + `Sincerely,\n`
  + `Automated-Pinoy-Hoops-Email`

  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('Email sent')
  });
}

// CLOUD VISION
function detectTextGCS(bucketName, fileName) {
  // [START vision_text_detection_gcs]
  // Imports the Google Cloud client libraries
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  var deposit = "deposit";
  var accountNum = "001820479151";
  var depBool = false;
  var acctNumBool = false;

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const bucketName = 'Bucket where the file resides, e.g. my-bucket';
  // const fileName = 'Path to file within bucket, e.g. path/to/image.png';

  // Performs text detection on the gcs file
  return client
    .textDetection(`gs://${bucketName}/${fileName}`)
    .then(results => {
      const detections = results[0].textAnnotations;
      console.log('Text:');
      detections.forEach(text => {
        //console.log(text);
        console.log('DESCRIPTION :' + text.description);
        if (text.description.toString().trim().toLowerCase() === deposit){
          depBool = true;
        }

        if (text.description.toString().trim() === accountNum){
          acctNumBool = true;
        }

      });

      if (depBool & acctNumBool){
        console.log("TRUE");
        return true;
      }else{
        return false;
        console.log("FALSE");
      }
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  // [END vision_text_detection_gcs]
}
