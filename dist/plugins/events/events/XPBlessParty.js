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
// Gain 1-3% XP
var XPBlessParty = (function (_super) {
    __extends(XPBlessParty, _super);
    function XPBlessParty() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    XPBlessParty.operateOn = function (player) {
        var _this = this;
        var member = _(player.party.players)
            .sortBy(['level'])
            .head();
        var percent = event_1.Event.chance.floating({ fixed: 5, min: 0.01, max: 0.03 });
        var xpMod = Math.floor(member._xp.maximum * percent);
        var eventText = this.eventText('blessXpParty', player, { xp: xpMod, partyName: player.party.name });
        _.each(player.party.players, function (member) {
            var totalXp = member.gainXp(xpMod, false);
            _this.emitMessage({ affected: [member], eventText: eventText + " [+" + totalXp.toLocaleString() + " xp, ~" + (percent * 100).toFixed(2) + "%]", category: adventure_log_1.MessageCategories.XP });
            if (!member.$statistics)
                return;
            member.$statistics.batchIncrement(['Character.Events', 'Character.Event.XPBlessParty']);
        });
    };
    return XPBlessParty;
}(event_1.Event));
XPBlessParty.WEIGHT = exports.WEIGHT;
exports.XPBlessParty = XPBlessParty;
