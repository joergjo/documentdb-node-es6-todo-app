const gulp = require('gulp');
const path = require('path');
const zip = require('gulp-zip');
const minimist = require('minimist');
const fs = require('fs');

const knownOptions = {
	string: ['packageName', 'packagePath'],
	default: { packageName: "Package.zip", packagePath: path.join(__dirname, '_package') }
};

const options = minimist(process.argv.slice(2), knownOptions);

gulp.task('default', () => { 
	// Left empty to provide compatiblity with Azure App Service deployment. 
});

gulp.task('pack', () => {

	const packagePaths = ['**',
		'!**/_package/**',
		'!_package',
		'!.vscode',
		'!.vscode/**',
		'!arm',
		'!arm/**',
		'!.env',
		'!.*ignore',
		'!*.json',
		'!Dockerfile',
		'!gulpfile.js'];

	//add exclusion patterns for all dev dependencies
	const packageJSON = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
	const devDeps = packageJSON.devDependencies;

	for (const propName in devDeps) {
		const excludePattern1 = '!**/node_modules/' + propName + '/**';
		const excludePattern2 = '!**/node_modules/' + propName;
		packagePaths.push(excludePattern1);
		packagePaths.push(excludePattern2);
	}

	return gulp.src(packagePaths)
		.pipe(zip(options.packageName))
		.pipe(gulp.dest(options.packagePath));
});
