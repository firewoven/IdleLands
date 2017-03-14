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
var XPBlessParty_1 = require("./XPBlessParty");
exports.WEIGHT = 108;
// Gain 1-3% XP
var XPBless = (function (_super) {
    __extends(XPBless, _super);
    function XPBless() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    XPBless.operateOn = function (player) {
        if (player.party && event_1.Event.chance.bool({ likelihood: 70 })) {
            XPBlessParty_1.XPBlessParty.operateOn(player);
            return player.party.players;
        }
        var percent = event_1.Event.chance.floating({ fixed: 5, min: 0.01, max: 0.03 });
        var baseXp = Math.floor(player._xp.maximum * percent);
        var xpMod = player.gainXp(baseXp);
        var eventText = this.eventText('blessXp', player, { xp: xpMod });
        this.emitMessage({ affected: [player], eventText: eventText + " [+" + xpMod.toLocaleString() + " xp, ~" + (percent * 100).toFixed(2) + "%]", category: adventure_log_1.MessageCategories.XP });
        return [player];
    };
    return XPBless;
}(event_1.Event));
XPBless.WEIGHT = exports.WEIGHT;
exports.XPBless = XPBless;
