#!/usr/bin/env node

var pjson = require('../package.json');
var fs = require('fs');
var AS3JS = require('../runtime.js');

var VERSION = pjson.version;

//AS3JS options
var srcPaths = [];
var output = null;
var silent = false;
var verbose = false;
var entry = null;
var dry = false;

//Command line args
var arg = null;
var option = null;
var command = null;

//Misc options

//Parse arguemnts
for(var i = 0; i < process.argv.length; i++) {
	arg = process.argv[i];
	if(command) {
		//Commands will go here if implemented
		command = null;
	} else if(option) {
		//Options are set here
		if(option == 'o') {
			output = arg; //File output
		} else if(option == 'src') {
			srcPaths = srcPaths.concat(arg.split(",")); //Source path(s) to parse
		} else if(option == 'e') {
			entry = arg;
		}
		option = null;
	} else {
		if(arg == '--verbose') {
			verbose = true;
		} else if(arg == '-d' || arg == '--dry') {
			dry = true;
		} else if(arg == '-s' || arg == '--silent') {
			silent = true;
		} else if(arg == '-o' || arg == '--output') {
			option = 'o'; //File output
		} else if(arg == '-src' || arg == '--sourcepath') {
			option = 'src'; //Source path(s)
		} else if(arg == '-e' || arg == '--entry') {
			option = 'e'; //Entry point
		} else if(arg == '-h' || arg == '--help') {
			//Help text
			console.log("Options:");
			console.log("\t[-o|--output]\t\tOutput file");
			console.log("\t[-src|-sourcepath]\tSource Path(s) (comma-separated)");
			console.log("\t[-e|--entry]\t\tEntry point (ex. \"[new|exports]:com.example.MyClass\")");
			console.log("\t[-h|--help]\t\tView Help");
			console.log("\t[-v|--version]\t\tView Version information");
			
			return;
		} else if(arg == '-v' || arg == '--version') {
			//Version info
			console.log("AS3JS for Node.js");
			console.log("Created by Greg McLeod (c) 2015");
			console.log("Version: " + VERSION);
			return;
		}
	}
}

if(srcPaths.length <= 0) {
	console.log("Error, must supply source path (-src)");
} else if(!output) {
	console.log("Error, must supply output path (-o)");
} else {
	var as3js = new AS3JS();
	var sourceText = as3js.compile({
		srcPaths: srcPaths,
		silent: silent,
		verbose: verbose,
		entry: entry
	});
	
	//Remove old output file if it exists
	if (output && !dry)
	{
		if (fs.existsSync(output))
		{
			fs.unlinkSync(output);
		}
		fs.writeFileSync(output || 'output.js', sourceText, "UTF-8", {flags: 'w+'});
	}
}
