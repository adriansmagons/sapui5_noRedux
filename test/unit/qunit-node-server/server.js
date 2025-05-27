const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

// Setup static file responses from disk
app.use(express.static(path.join(__dirname, 'public')));
app.use('/data', express.static(path.join(__dirname, '../data')));
app.use('/test/ui5/fitnessApp', express.static(path.join(__dirname, '../ui5/fitnessApp')));
app.use(`/ui5/fitnessApp`, (req, res, next) => {
		express.static(path.join(__dirname, '../../../webapp'))(req, res, next);
});
app.get('/testsuite.js', (req, res) => {
	const dependencies = getTestFileList(path.join(__dirname, '../ui5'))
		.map((fileName) => fileName.split('.').slice(0, -1).join('.'))
		.map((fileName) => `'test/${fileName}'`)
		.join(',');
	res.setHeader('Content-type', 'application/javascript');
	res.send(`sap.ui.require(['sap/ui/qunit/qunit-2-css', 'sap/ui/thirdparty/qunit-2', 'sap/ui/qunit/qunit-coverage', ${dependencies}]);`);
});

app.use('*', function (req, res) {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// start with http://localhost:8000

function getTestFileList(sDirectory) {
	var aHtmlFiles = [];
	var aFiles = fs.readdirSync(sDirectory);
	var i;
	var oStats;
	var sFullPath;

	for (i in aFiles) {
		sFullPath = sDirectory + '/' + aFiles[i];
		oStats = fs.statSync(sFullPath);
		if (oStats.isDirectory()) {
			Array.prototype.push.apply(aHtmlFiles, getTestFileList(sFullPath));
		}
		if (oStats.isFile() && sFullPath.indexOf('.test.js') >= 0) {
			aHtmlFiles.push(sFullPath.replace(path.join(__dirname, '../ui5', '../'), ''));
		}
	}
	return aHtmlFiles;
}

module.exports = app;
