"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var actualConstitute = require("constitute");
var container = null;
exports.constitute = function (Class) {
    if (!container) {
        return actualConstitute(Class);
    }
    return container.constitute(Class);
};
// used for intercepting constitutes during tests, otherwise regular constitute is used.
exports.setConstituteContainer = function (newContainer) {
    container = newContainer;
};
