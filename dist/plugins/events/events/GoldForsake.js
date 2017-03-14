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
exports.WEIGHT = 72;
// Lose 25-2000 Gold
var GoldForsake = (function (_super) {
    __extends(GoldForsake, _super);
    function GoldForsake() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GoldForsake.operateOn = function (player) {
        var value = event_1.Event.chance.integer({ min: 10, max: 500 * player.level });
        if (event_1.Event.chance.bool({ likelihood: 5 })) {
            var maxGoldLost = Math.max(1000, Math.round(player.gold * 0.03));
            var baseGold = Math.floor(event_1.Event.chance.integer({ min: 25, max: maxGoldLost }));
            value = baseGold;
        }
        var goldMod = Math.min(player.gold, Math.abs(player.gainGold(-value)));
        var eventText = this.eventText('forsakeGold', player, { gold: goldMod });
        this.emitMessage({ affected: [player], eventText: eventText + " [-" + goldMod.toLocaleString() + " gold]", category: adventure_log_1.MessageCategories.GOLD });
        return [player];
    };
    return GoldForsake;
}(event_1.Event));
GoldForsake.WEIGHT = exports.WEIGHT;
exports.GoldForsake = GoldForsake;
