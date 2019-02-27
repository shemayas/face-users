// map to array with objects faceId: ddd, name: ddd, email: ddd
// how much time
console.time("Time of process");

const fs = require('fs'),
      Promise = require('bluebird');

let files = [],
    readDir = Promise.promisify(fs.readdir),
    readFile = Promise.promisify(fs.readFile);

// read directory with all files to process
readDir('./LEADS').then((dirFiles) => {
    files = dirFiles;

}).catch((err) => {
    console.log('error when tring to read file dir: ' + err);
    return;
}).then(() => {
    // loop on files and process them
    Promise.reduce(files, function(result, fileName, index, length) {
        return readFile('./LEADS/' + fileName, "utf8").then(function(contents) {
            return convertToJson(result, contents);
        });
    }, {}).then(function(total) {
        // end the timer
        console.timeEnd("Time of process");

        // write results into file
        fs.writeFileSync("./result.json", JSON.stringify(Object.values(total), null, 4), function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log("The file was saved!");
        });
    });
})



/**
 * 
 * @param {Array} result - the accumelated result of the json object from previous files
 * @param {String} contents - the contents of a unparsed file 
 */
function convertToJson(result, contents) {
    // assign the new result into new object for optimiztion
    return Object.assign(
        {}, 
        result, 
        processRows(contents.split("\n"))
    );
}

/**
 * convert array of texts into object properties
 * @param {Array} rows
 * @returns {Object} 
 */
function processRows(rows) {
    let accumelatedRows = {};
    rows.forEach(function(row) {
        let arrRow = row.split(',');
        accumelatedRows[arrRow[0]] = formatRow(arrRow);
    });
    return accumelatedRows;
}

/**
 * format row data into key value of type object
 * @param {Array} row
 * @returns {Object} 
 */
function formatRow(row) {
    return {faceId: row[0], name: row[1], faceEmail: row[2]};
}


