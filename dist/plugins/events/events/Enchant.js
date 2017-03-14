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
var stat_calculator_1 = require("../../../shared/stat-calculator");
exports.WEIGHT = 6;
// Enchant an item (+special stat, +50 to random stat, +1 enchantLevel)
var Enchant = (function (_super) {
    __extends(Enchant, _super);
    function Enchant() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Enchant.operateOn = function (player) {
        var item = this.pickValidItemForEnchant(player);
        if (!item) {
            var enchantTotal = _.sumBy(_.values(player.equipment), 'enchantLevel');
            if (enchantTotal < 100)
                return [];
            var eventText_1 = this._parseText('%player attempted to enchant %hisher gear, but it failed!', player);
            this.emitMessage({ affected: [player], eventText: eventText_1, category: adventure_log_1.MessageCategories.ITEM });
            player.$statistics.incrementStat('Character.Item.OverEnchant');
            return [];
        }
        var eventText = this.eventText('enchant', player, { item: item.fullname });
        item.enchantLevel = item.enchantLevel || 0;
        item.enchantLevel++;
        if (event_1.Event.chance.bool({ likelihood: 75 })) {
            var stat = this.pickStat(item);
            var boost = 50;
            eventText = eventText + " [" + stat + " " + item[stat] + " -> " + (item[stat] + boost) + "]";
            item[stat] += boost;
        }
        else {
            var _a = _.sample(stat_calculator_1.SPECIAL_STATS_BASE.concat(stat_calculator_1.ATTACK_STATS_BASE)), enchantMax = _a.enchantMax, name_1 = _a.name;
            item[name_1] = item[name_1] || 0;
            eventText = eventText + " [" + name_1 + " " + item[name_1] + " -> " + (item[name_1] + enchantMax) + "]";
            item[name_1] += enchantMax;
        }
        this.emitMessage({ affected: [player], eventText: eventText, category: adventure_log_1.MessageCategories.ITEM });
        item.score;
        player.recalculateStats();
        player.$updateEquipment = true;
        return [player];
    };
    return Enchant;
}(event_1.Event));
Enchant.WEIGHT = exports.WEIGHT;
exports.Enchant = Enchant;
