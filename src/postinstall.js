var exec = require("child_process").exec;
var os = require("os");

const generalCmd = exec(
	"rn-nodeify --install buffer,stream,assert,events,crypto,vm,process --hack"
);

function postInstallMac() {
	exec(`${generalCmd}`);
}
function postInstallLinWin() {
	exec(`${generalCmd}`);
}

if (os.type() === "Linux")
	postInstallLinWin();
else if (os.type() === "Windows_NT")
	postInstallLinWin();
else if (os.type() === "Darwin")
	postInstallMac();
else
	throw new Error("Unsupported OS found: " + os.type());
