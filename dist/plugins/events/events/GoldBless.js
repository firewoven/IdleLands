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
var GoldBlessParty_1 = require("./GoldBlessParty");
exports.WEIGHT = 216;
// Gain 10-1000 Gold
var GoldBless = (function (_super) {
    __extends(GoldBless, _super);
    function GoldBless() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GoldBless.operateOn = function (player) {
        if (player.party && event_1.Event.chance.bool({ likelihood: 70 })) {
            GoldBlessParty_1.GoldBlessParty.operateOn(player);
            return player.party.members;
        }
        var value = event_1.Event.chance.integer({ min: 10, max: 350 * player.level });
        if (event_1.Event.chance.bool({ likelihood: 1 })) {
            var maxGoldGained = Math.max(1000, Math.round(player.gold * 0.02));
            var baseGold = Math.floor(event_1.Event.chance.integer({ min: 10, max: maxGoldGained }));
            value = baseGold;
        }
        var goldMod = player.gainGold(value);
        var eventText = this.eventText('blessGold', player, { gold: goldMod });
        this.emitMessage({ affected: [player], eventText: eventText + " [+" + goldMod.toLocaleString() + " gold]", category: adventure_log_1.MessageCategories.GOLD });
        return [player];
    };
    return GoldBless;
}(event_1.Event));
GoldBless.WEIGHT = exports.WEIGHT;
exports.GoldBless = GoldBless;
