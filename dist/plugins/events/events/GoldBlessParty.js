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
exports.WEIGHT = -1;
// Gain 10-1000 Gold
var GoldBlessParty = (function (_super) {
    __extends(GoldBlessParty, _super);
    function GoldBlessParty() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GoldBlessParty.operateOn = function (player) {
        var _this = this;
        var goldMod = Math.floor(event_1.Event.chance.integer({ min: 10, max: 10000 }));
        var eventText = this.eventText('blessGoldParty', player, { gold: goldMod, partyName: player.party.name });
        _.each(player.party.players, function (member) {
            var totalGold = member.gainGold(goldMod, false);
            _this.emitMessage({ affected: [member], eventText: eventText + " [+" + totalGold.toLocaleString() + " gold]", category: adventure_log_1.MessageCategories.GOLD });
            if (!member.$statistics)
                return;
            member.$statistics.batchIncrement(['Character.Events', 'Character.Event.GoldBlessParty']);
        });
    };
    return GoldBlessParty;
}(event_1.Event));
GoldBlessParty.WEIGHT = exports.WEIGHT;
exports.GoldBlessParty = GoldBlessParty;
