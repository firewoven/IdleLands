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
var event_1 = require("../event");
var adventure_log_1 = require("../../../shared/adventure-log");
exports.WEIGHT = 36;
// Lose 3-5% XP
var XPForsake = (function (_super) {
    __extends(XPForsake, _super);
    function XPForsake() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    XPForsake.operateOn = function (player) {
        var percent = event_1.Event.chance.floating({ fixed: 5, min: 0.03, max: 0.05 });
        var baseXP = Math.floor(player._xp.maximum * percent);
        var xpMod = player.gainXp(-baseXP);
        var eventText = this.eventText('forsakeXp', player, { xp: Math.abs(xpMod) });
        this.emitMessage({ affected: [player], eventText: eventText + " [-" + Math.abs(xpMod).toLocaleString() + " xp, ~" + (percent * 100).toFixed(2) + "%]", category: adventure_log_1.MessageCategories.XP });
        return [player];
    };
    return XPForsake;
}(event_1.Event));
XPForsake.WEIGHT = exports.WEIGHT;
exports.XPForsake = XPForsake;
