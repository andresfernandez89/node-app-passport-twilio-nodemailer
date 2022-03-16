import log4js from "log4js";

log4js.configure({
	appenders: {
		loggerConsole: {type: "console"},
		loggerWarm: {type: "file", filename: "warn.log"},
		loggerError: {type: "file", filename: "error.log"},
	},
	categories: {
		default: {appenders: ["loggerConsole"], level: "info"},
		routeNotExist: {appenders: ["loggerWarm"], level: "warn"},
		apisError: {appenders: ["loggerError"], level: "error"},
	},
});

export default log4js;
