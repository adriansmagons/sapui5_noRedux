const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const app = require('./server');

const port = 8600;
const targetURL = 'http://localhost:8600/?coverage';
const timeout = 300000;
const server = app.listen(port, () => console.log('HTTP server started'));

// Based on https://github.com/davidtaylorhq/qunit-puppeteer
(async (fs, path, __dirname) => {
	const browser = await puppeteer.launch({
		args: ['--no-sandbox'],
	});
	const page = await browser.newPage();

	console.log('Browser opened');

	// Attach to browser console log events, and log to node console
	await page
		.on('console', (event) => {
			console.log(event.text());
		})
		.on('pageerror', ({ message }) => {
			console.log(`\n` + message);
		})
		.on('requestfailed', (request) => {
			console.log(`${request.failure().errorText} ${request.url()}`);
		});

	let moduleErrors = [];
	let testErrors = [];
	let assertionErrors = [];

	await page.exposeFunction('harness_moduleDone', (context) => {
		if (context.failed) {
			let msg = 'Module Failed: ' + context.name + '\n' + testErrors.join('\n');
			moduleErrors.push(msg);
			testErrors = [];
		}
	});

	await page.exposeFunction('harness_testDone', (context) => {
		if (context.failed) {
			let msg = '  Test Failed: ' + context.name + assertionErrors.join('    ');
			testErrors.push(msg);
			assertionErrors = [];
			process.stdout.write('F');
		} else {
			process.stdout.write('.');
		}
	});

	await page.exposeFunction('harness_log', (context) => {
		if (context.result) {
			return;
		} // If success don't log

		let msg = '\n    Assertion Failed:';
		if (context.message) {
			msg += ' ' + context.message;
		}

		if (context.expected) {
			msg += '\n      Expected: ' + context.expected + ', Actual: ' + context.actual;
		}

		assertionErrors.push(msg);
	});

	await page.exposeFunction(
		'harness_done',
		function (fs, path, __dirname, context, coverage) {
			console.log('\n');

			if (moduleErrors.length > 0) {
				for (let idx = 0; idx < moduleErrors.length; idx++) {
					console.error(moduleErrors[idx] + '\n');
				}
			}

			// create lcov coverage report
			let lcov = '';
			Object.keys(coverage)
				.filter(function (sFileName) {
					return sFileName.indexOf('ui5/fitnessApp') === 0;
				})
				.forEach(function (filename) {
					let data = coverage[filename];
					let fileReport = '';
					fileReport += 'SF:' + filename + '\n';
					data.forEach(function (value, index) {
						if (value !== undefined && value !== null) {
							fileReport += 'DA:' + index + ',' + value + '\n';
						}
					});
					fileReport += 'end_of_record\n';
					lcov += fileReport;
				});

			let reportsDirPath = path.join(__dirname, '../reports');
			let lcovReportPath = path.join(reportsDirPath, '/report.lcov');

			if (!fs.existsSync(reportsDirPath)) {
				fs.mkdirSync(reportsDirPath);
			}
			fs.writeFileSync(lcovReportPath, lcov, { encoding: 'utf8', flag: 'w' });

			console.log('lcov report saved to file: ' + lcovReportPath);

			let stats = ['Time: ' + context.runtime + 'ms', 'Total: ' + context.total, 'Passed: ' + context.passed, 'Failed: ' + context.failed];
			console.log(stats.join(', '));

			browser.close();
			server.close();
			if (context.failed > 0) {
				process.exit(1);
			} else {
				process.exit();
			}
		}.bind(this, fs, path, __dirname)
	);

	await page.goto(targetURL);

	await page.evaluate(() => {
		QUnit.config.testTimeout = 10000;

		// Cannot pass the window.harness_blah methods directly, because they are
		// automatically defined as async methods, which QUnit does not support
		QUnit.moduleDone((context) => {
			window.harness_moduleDone(context);
		});
		QUnit.testDone((context) => {
			window.harness_testDone(context);
		});
		QUnit.log((context) => {
			window.harness_log(context);
		});
		QUnit.done((context) => {
			let coverage = window._$blanket;
			window.harness_done(context, coverage);
		});
	});

	function wait(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	await wait(timeout);

	console.error('Tests timed out');
	browser.close();
	server.close();
	process.exit(124);
})(fs, path, __dirname).catch((error) => {
	console.error(error);
	server.close();
	process.exit(1);
});
