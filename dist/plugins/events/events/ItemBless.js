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
exports.WEIGHT = 270;
// Bless an item (random stat +5%)
var ItemBless = (function (_super) {
    __extends(ItemBless, _super);
    function ItemBless() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemBless.operateOn = function (player) {
        var item = this.pickValidItemForBless(player);
        if (!item)
            return;
        var stat = this.pickStat(item);
        if (!stat)
            return;
        var boost = item[stat] === 0 ? 5 : Math.max(3, Math.abs(Math.floor(item[stat] / 20)));
        var eventText = this.eventText('blessItem', player, { item: item.fullname });
        this.emitMessage({ affected: [player], eventText: eventText + " [" + stat + " " + item[stat].toLocaleString() + " -> " + (item[stat] + boost).toLocaleString() + "]", category: adventure_log_1.MessageCategories.ITEM });
        item[stat] += boost;
        item.score;
        player.recalculateStats();
        player.$updateEquipment = true;
        return [player];
    };
    return ItemBless;
}(event_1.Event));
ItemBless.WEIGHT = exports.WEIGHT;
exports.ItemBless = ItemBless;
