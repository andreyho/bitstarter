#!/usr/bin/env node
var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var restler = require('restler');
var HTMLFILE_DEFAULT   = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URLFILE_DEFAULT    = undefined; //"http://young-cove-7125.herokuapp.com";

var assertFileExists = function(infile) {
  var instr = infile.toString();
  if (!fs.existsSync(instr)) {
    console.log("%s does not exist. Exiting.", instr);
    process.exit(1);
  }
  return instr;
};

var assertUrlExists = function(inpath) {
  restler.get(inpath).on('complete', function(result, response) {
    if (result instanceof Error) {
      console.err('Error: ' + util.format(response.message));
      return undefined;
    } else {
      var urlfile = "urlindex~html";
      fs.writeFileSync(urlfile, result);
//      console.log("Downloaded %s to %s", inpath, urlfile);
      console.log(JSON.stringify(checkHtmlFile(urlfile,program.checks), null, 4));
      return "urlindex~html";
    }
  });
};

var cheerioHtmlFile = function(htmlfile) {
  return cheerio.load(fs.readFileSync(htmlfile));
}

var loadChecks = function(checksfile) {
  return JSON.parse(fs.readFileSync(checksfile));
}

var checkHtmlFile = function(htmlfile, checksfile) {
  $ = cheerioHtmlFile(htmlfile);
  var checks = loadChecks(checksfile).sort();
  var out = {};
  for (var ii in checks) {
    var present = $(checks[ii]).length > 0;
    out[checks[ii]] = present;
  }
  return out;
};

if (require.main == module) {
  program
    .option('-c, --checks <file>', 'Path to checks.json', assertFileExists, CHECKSFILE_DEFAULT)
    .option('-f, --file <file> ', 'Path to index.html', assertFileExists, HTMLFILE_DEFAULT)
    .option('-u, --url <url> ', 'URL to index.html', assertUrlExists, URLFILE_DEFAULT)
    .parse(process.argv);

  if (!program.url) {
    checkJson = checkHtmlFile(program.file,program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
  }
} else {
  exports.checkHtmlFile = checkHtmlFile;
}
