// map to array with objects faceId: ddd, name: ddd, email: ddd
// how much time
console.time("Time of process");

const fs = require('fs'),
      Promise = require('bluebird');


const readDir = Promise.promisify(fs.readdir),
      readFile = Promise.promisify(fs.readFile),
      writeFile = Promise.promisify(fs.writeFile);

// read directory with all files to process
(async () => {
    const files = await readDir('./LEADS');
    
    const result = await files.reduce( async (result, fileName) => {
        const contents = await readFile('./LEADS/' + fileName, "utf8");
        return convertToJson(await result, contents);
    }, {});

    // end the timer
    console.timeEnd("Time of process");

    console.log("Number of items: " + Object.keys(result).length);

    // write results into file
    await writeFile("./result-await.json", JSON.stringify(Object.values(result), null, 4));

    console.log("The file was saved!");
})();

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


