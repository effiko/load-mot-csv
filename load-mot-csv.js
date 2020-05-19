const redis = require('redis') ;
const rejson = require('redis-rejson');
const wget = require('wget-improved');
const fs = require('fs');
const src = 'https://data.gov.il/api/action/datastore_search?resource_id=bf9df4e2-d90d-4c0a-a400-19e15af8e95f&limit=200000';
const output = '/tmp/bikes1';

rejson(redis); // important - this must come BEFORE creating the client 
let client = redis.createClient(6379);


var sendDate = (new Date()).getTime();
const options = {
    // see options below
};
let download = wget.download(src, output, options);
download.on('error', function(err) {
    console.log(err);
});
download.on('start', function(fileSize) {
    console.log(fileSize);
});
download.on('end', function(res) {
    var endDate = (new Date()).getTime();
    console.log('Request took ' + (endDate -  sendDate) + ' mSec');
    sendDate = (new Date()).getTime();
    data = fs.readFileSync(output);
    json = JSON.parse(data);
    console.log(json);
    endDate = (new Date()).getTime();
    console.log('Parsing took ' + (endDate -  sendDate) + ' mSec');
    startDate = (new Date()).getTime();


    var lineNumber = 0 ;
    json.result.records.forEach((jsonRow)=>{
      if ((lineNumber++ % 1000) === 0) {
        console.log('Saved ' + lineNumber);
      }
      row =  JSON.stringify(jsonRow);
      client.json_set(jsonRow.mispar_rechev, '.', JSON.stringify(jsonRow), function (err) {
        if (err) {console.log('Error = '+err)}
      })} 
    )
    console.log('Total saved ' + lineNumber + ' records ');
    endDate = (new Date()).getTime();
    console.log('Loading to Redis DB took ' + (endDate -  startDate) + ' mSec');
  
});
download.on('progress', function(progress) {
    typeof progress === 'number'
    // code to show progress bar
});