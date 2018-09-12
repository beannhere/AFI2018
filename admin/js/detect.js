
  
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    projectId: 'pinashoops2018'
  });
  var bucketName = "pinashoops2018.appspot.com";
  var fileName = "receipt1.JPG";
  
  client
    .textDetection(`gs://${bucketName}/${fileName}`)
    .then(results => {
      console.log("------------------ "+results);
      const detections = results[0].textAnnotations;
      console.log('Text:');
      detections.forEach(text => console.log(text));
    })
    .catch(err => {
      console.error('ERROR:', err);
    });


