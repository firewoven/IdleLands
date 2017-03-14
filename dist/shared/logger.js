"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rollbar = require("rollbar");
var rollbarToken = process.env.ROLLBAR_ACCESS_TOKEN;
var isQuiet = process.env.QUIET;
if (rollbarToken) {
    rollbar.init(rollbarToken);
}
var Logger = (function () {
    function Logger() {
    }
    Logger._formatMessage = function (tag, message) {
        return "[" + new Date() + "] {" + tag + "} " + message;
    };
    Logger.error = function (tag, error, payload) {
        console.error(this._formatMessage(tag, error.message));
        if (error.stack) {
            console.error(error.stack);
        }
        if (payload) {
            console.error('PAYLOAD', payload);
        }
        if (rollbarToken) {
            if (payload) {
                rollbar.handleErrorWithPayloadData(error, payload);
            }
            else {
                rollbar.handleError(error);
            }
        }
    };
    Logger.info = function (tag, message) {
        if (isQuiet)
            return;
        console.info(this._formatMessage(tag, message));
    };
    Logger.silly = function (tag, message) {
        if (!process.env.DEBUG_SILLY)
            return;
        console.info(this._formatMessage(tag, message));
    };
    return Logger;
}());
exports.Logger = Logger;
process.on('uncaughtException', function (err) {
    Logger.error('PROCESS:BAD:EXCEPTION', err);
    process.exit(2);
});
process.on('unhandledRejection', function (err) {
    Logger.error('PROCESS:BAD:REJECTION', err);
    process.exit(1);
});
