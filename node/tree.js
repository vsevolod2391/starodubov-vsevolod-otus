var fs = require('fs');


if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " path/to");
    process.exit(-1);
}
var path = process.argv[2];

const memo = {'files': [], 'dirs': []};

let getFiles = (path) => new Promise(resolve => fs.readdir(path, function (err, dir) {
    if (err) throw err;

    let promises = [];
    for (let i = 0; i < dir.length; i++) {
        let promise = new Promise(resolve => fs.stat(path + "/" + dir[i], function (err, stats) {
            if (err) throw err;
            resolve(stats);
        })).then(stats => {
            if (stats.isFile()) {
            memo.files.push(path + "/" + dir[i]);
            return memo;
        }
    else if (stats.isDirectory()) {
            let pathDir = path + "/" + dir[i];
            memo.dirs.push(pathDir);
            return getFiles(pathDir);
        }
    });
        promises.push(promise);
    }

    Promise.all(promises).then(value => resolve(value.pop()));

}));

getFiles(path).then(console.log);
