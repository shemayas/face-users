// map to array with objects faceId: ddd, name: ddd, email: ddd
// how much time

const fs = require('fs'),
      Promise = require('bluebird');

let files = [],
    readDir = Promise.promisify(fs.readdir),
    readFile = Promise.promisify(fs.readFile);

// create initial file
fs.writeFileSync("./result.json", "[]", function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 

// read directory with all files to process
readDir('./LEADS').then((dirFiles) => {
    files = dirFiles;

}).catch((err) => {
    console.log('error when tring to read file dir: ' + err);
    return;
})

Promise.reduce(files, function(result, fileName) {
    return fs.readFileAsync(fileName, "utf8").then(function(contents) {
        return convertToJson(result, fileName);
    }, '[]');
}, 0).then(function(total) {
    //Total is 30
});

function convertToJson(result, fileName) {
    
}


