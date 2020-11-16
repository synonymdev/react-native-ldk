const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;
const extract = require('extract-zip');

const BASE_PATH = `${__dirname}/../..`;
const BASE_ANDROID_PATH = `${BASE_PATH}/android`;
const BASE_IOS_PATH = `${BASE_PATH}/ios`;
const LND_MOBILE_DOWNLOAD_PATH = "https://github.com/coreyphillips/react-native-lightning/releases/download/v0.0.1/";

let packageJson = ""
try {packageJson = require(`${BASE_PATH}/package.json`);} catch {return;}

const createFile = async (source, filePath) => {
	return new Promise(async (resolve) => {
		if (!fs.existsSync(filePath)) {
			fs.copyFile(source, filePath, err => {
				if (err) throw err;
			});
			resolve();
		} else {resolve()}
	})
}

const mkDirByPathSync = (targetDir, { isRelativeToScript = false } = {}) => {
	const sep = path.sep;
	const initDir = path.isAbsolute(targetDir) ? sep : '';
	const baseDir = isRelativeToScript ? __dirname : '.';
	
	return targetDir.split(sep).reduce((parentDir, childDir) => {
		const curDir = path.resolve(baseDir, parentDir, childDir);
		try {
			fs.mkdirSync(curDir);
		} catch (err) {
			if (err.code === 'EEXIST') { // curDir already exists!
				return curDir;
			}
			
			// To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
			if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
				throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
			}
			
			const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
			if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
				throw err; // Throw if it's just the last created dir.
			}
		}
		
		return curDir;
	}, initDir);
}

const getFilePath = (startPath,filter,callback) => {
	if (!fs.existsSync(startPath)){
		console.log("No dir ",startPath);
		return;
	}
	const files=fs.readdirSync(startPath);
	for(let i=0;i<files.length;i++){
		const filePath=path.join(startPath,files[i]);
		const stat = fs.lstatSync(filePath);
		if (stat.isDirectory()){
			getFilePath(filePath,filter,callback); //recurse
		}
		else if (filePath.includes(filter)) {
			callback(filePath);
			break;
		}
	}
}

const downloadFile = (source, destination) => {
	return new Promise((resolve) => {
		try {
			const cmd = `curl -L ${source} -o ${destination}`;
			exec(cmd, (error, stdout, stderr) => {
				if (error) console.warn(error);
				resolve(stdout ? stdout : stderr);
			});
		} catch (e) {resolve(e);}
	});
};

let generalFiles = [
	{
		//Copy postinstall.js -> ./
		source: "src/postinstall.js",
		destination: BASE_PATH,
		filename: "postinstall.js"
	},
];

let androidFiles = [
	{
		//Copy lnd.conf -> android/app/src/main/assets
		source: "src/lnd.conf",
		destination: `${BASE_ANDROID_PATH}/app/src/main/assets`,
		filename: "lnd.conf"
	},
	{
		//Copy build.gradle -> android/Lndmobile
		source: "src/android/build.gradle",
		destination: `${BASE_ANDROID_PATH}/Lndmobile`,
		filename: "build.gradle"
	},
];

let iosFiles = [
	{
		//Copy lnd.conf -> ios/lightning/
		source: "src/lnd.conf",
		destination: `${BASE_IOS_PATH}/lightning`,
		filename: "lnd.conf"
	},
	{
		//Copy build.gradle -> ios/lightning/
		source: "src/ios/LndReactModule.h",
		destination: `${BASE_IOS_PATH}/lightning`,
		filename: "LndReactModule.h"
	},
	{
		//Copy build.gradle -> ios/lightning/
		source: "src/ios/LndReactModule.m",
		destination: `${BASE_IOS_PATH}/lightning`,
		filename: "LndReactModule.m"
	},
];

const updatePackageName = (filePath, packageName) => {
	// read file and convert to array by line break
	let csvContent = fs.readFileSync(filePath).toString().split('\n');
	csvContent[0] = `package ${packageName};`; // replace the the first element from array
	csvContent = csvContent.join('\n'); // convert array back to string
	fs.writeFileSync(filePath, csvContent);
}

const generalSetup = () => {
	generalFiles.forEach(async ({ source, destination, filename }) => {
		const filePath = `${destination}/${filename}`;
		if (!fs.existsSync(filePath)) {
			mkDirByPathSync(destination);
			await createFile(source, filePath);
		}
	});
	
	//Setup postinstall script
	let postinsall = undefined;
	try {postinsall = packageJson["scripts"]["postinstall"];} catch {}
	const postInstallScript = "node postinstall.js";
	if (postinsall && !postinsall.includes(postInstallScript)) {
		injectText(
			`${BASE_PATH}/package.json`,
			"postinstall",
			`"postinstall": "${postinsall} && ${postInstallScript}",`,
			0,
			true
		)
	} else {
		injectText(
			`${BASE_PATH}/package.json`,
			"scripts",
			`"postinstall": "${postInstallScript}",`,
			1
		)
	}
};

const setupAndroid = () => {
	getFilePath(`${BASE_ANDROID_PATH}/app/src/main/java/`,"MainActivity.java",filePath =>{
		const path = filePath.replace("/MainActivity.java", "");
		if (!path){
			console.log("Unable to find path to MainActivity.java");
			return;
		} else {
			const files = ["LndNativeModule.java", "LndNativePackage.java"];
			files.forEach((f) => {
				//Copy f -> path
				androidFiles.push({
					source: `src/android/${f}`,
					destination: path,
					filename: f
				})
			});
		}
		const packageName = path.replace(`${BASE_ANDROID_PATH}/app/src/main/java/`, "").replace("/", ".");
		androidFiles.forEach(async ({ source, destination, filename }) => {
			const filePath = `${destination}/${filename}`;
			if (!fs.existsSync(filePath)) {
				mkDirByPathSync(destination);
				await createFile(source, filePath);
				if (filename.includes(".java")) updatePackageName(filePath, packageName);
			}
		});
		
		//Add LND Native Package to MainApplication.java
		injectText(
			`${path}/MainApplication.java`,
			"return packages",
			"packages.add(new LndNativePackage());",
			-1
		);
		//Add Lndmobile implementation to build.gradle
		injectText(
			`${BASE_ANDROID_PATH}/app/build.gradle`,
			"dependencies {",
			"implementation project(path: ':Lndmobile')",
			1
		);
		//Append Lndmobile to project in settings.gradle
		injectText(
			`${BASE_ANDROID_PATH}/settings.gradle`,
			":app",
			", ':Lndmobile'",
			0
		);
	});
	
	//Create Lndmobile path & download Lndmobile.aar
	const lndMobileDest = `${BASE_ANDROID_PATH}/Lndmobile`;
	const lndMobileName = "Lndmobile.aar";
	if (!fs.existsSync(lndMobileDest)) mkDirByPathSync(lndMobileDest);
	if (!fs.existsSync(`${lndMobileDest}/${lndMobileName}`)) {
		const source = `${LND_MOBILE_DOWNLOAD_PATH}${lndMobileName}`;
		const destination = `${lndMobileDest}/${lndMobileName}`;
		downloadFile(source, destination);
	}
};

const setupIos = async () => {
	const lndMobileDest = `${BASE_IOS_PATH}/lightning`;
	
	//Create Lndmobile path & download Lndmobile.framework.zip
	if (!fs.existsSync(lndMobileDest)) mkDirByPathSync(lndMobileDest);
	iosFiles.forEach(async ({ source, destination, filename }) => {
		const filePath = `${destination}/${filename}`;
		if (!fs.existsSync(filePath)) {
			mkDirByPathSync(destination);
			await createFile(source, filePath);
		}
	});
	
	//Download, extract and delete Lndmobile.framework.zip
	const lndMobileName = "Lndmobile.framework.zip";
	const zipDestination = `${lndMobileDest}/${lndMobileName}`;
	if (!fs.existsSync(`${lndMobileDest}/${lndMobileName}`)) {
		const source = `${LND_MOBILE_DOWNLOAD_PATH}${lndMobileName}`;
		await downloadFile(source, zipDestination);
		await extract(zipDestination, { dir: `${lndMobileDest}/` });
	}
	fs.unlinkSync(zipDestination);
};

const injectText = (filePath, searchString = "", textToInject = "", injectIndex = 0) => {
	let csvContent = fs.readFileSync(filePath).toString().split('\n');
	let index = -1;
	let textAlreadyExists = false;
	for (let i = 0; i < csvContent.length; i++) {
		if (csvContent[i].includes(textToInject)) {
			textAlreadyExists = true;
			break;
		}
		if (csvContent[i].includes(searchString)) index = i;
	}
	if (index < 0 || textAlreadyExists) return;
	//If 0, append to the matched index
	if (injectIndex === 0) {
		csvContent[index] = `${csvContent[index]}${textToInject}`;
	} else {
		if (injectIndex < 0) injectIndex = injectIndex + 1;
		csvContent.splice(index+injectIndex, 0, textToInject);
	}
	csvContent = csvContent.join('\n'); // convert array back to string
	fs.writeFileSync(filePath, csvContent);
};

generalSetup();
setupAndroid();
setupIos();
