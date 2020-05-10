// convert the csv file received fo MOT to a json file

const options = {'delimiter': '|', };
var csvjson = require('csvjson');
const csvFilePath = './bikes.txt';
const fs = require('fs');

const
  redis = require('redis'),
  rejson = require('redis-rejson');

var data = fs.readFileSync(csvFilePath, { encoding : 'utf8'});
/*
{
    delimiter : <String> optional default is ","
    quote     : <String|Boolean> default is null
}

var options = {
  delimiter : '|', // optional
  quote     : '"' // optional
};
*/
// for multiple delimiter you can use regex pattern like this /[,|;]+/
 
/* 
  for importing headers from different source you can use headers property in options 
  var options = {
    headers : "sr,name,age,gender"
  };
*/
 
json = csvjson.toObject(data, options);
console.log (json.length);

rejson(redis); /* important - this must come BEFORE creating the client */
let client = redis.createClient(4567);
var lineNumber = 0 ;
json.forEach((jsonRow)=>{
  if ((lineNumber++ % 1000) === 0) {
    console.log('Saved ' + lineNumber);
  }
  row =  JSON.stringify(jsonRow);
  client.json_set(jsonRow.mispar_rechev, '.', JSON.stringify(jsonRow), function (err) {
    if (err) {console.log('Error = '+err)}
  })} 
)
console.log('Total saved ' + lineNumber + ' records ');
client.json_get('03455432', '.', function (err, value) {
  if (err) {console.log('Error = '+err)}
  console.log('value of 03455432:', value); 
  client.quit();
})
