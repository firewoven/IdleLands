"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var event_1 = require("../event");
var adventure_log_1 = require("../../../shared/adventure-log");
var basetowncrier_1 = require("../basetowncrier");
exports.WEIGHT = 36;
// Spout helpful information
var TownCrier = (function (_super) {
    __extends(TownCrier, _super);
    function TownCrier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TownCrier.operateOn = function (player) {
        var messageObject = _.sample(basetowncrier_1.SystemTownCrierMessages);
        this.emitMessage({ affected: [player], eventText: messageObject.message, extraData: messageObject, category: adventure_log_1.MessageCategories.TOWNCRIER });
        return [player];
    };
    return TownCrier;
}(event_1.Event));
TownCrier.WEIGHT = exports.WEIGHT;
exports.TownCrier = TownCrier;
