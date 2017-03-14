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
exports.WEIGHT = 1;
// Switcheroo an item (flip any stat between positive and negative)
var Switcheroo = (function (_super) {
    __extends(Switcheroo, _super);
    function Switcheroo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Switcheroo.operateOn = function (player) {
        var item = this.pickValidItem(player);
        if (!item)
            return;
        var stat = this.pickStat(item);
        if (!item[stat])
            return;
        var eventText = this.eventText('flipStat', player, { item: item.fullname });
        this.emitMessage({ affected: [player], eventText: eventText + " [" + stat + " " + item[stat] + " -> " + -item[stat] + "]", category: adventure_log_1.MessageCategories.ITEM });
        item[stat] = -item[stat];
        item.score;
        player.recalculateStats();
        player.$updateEquipment = true;
        return [player];
    };
    return Switcheroo;
}(event_1.Event));
Switcheroo.WEIGHT = exports.WEIGHT;
exports.Switcheroo = Switcheroo;
