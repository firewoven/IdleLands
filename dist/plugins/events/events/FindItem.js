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
var equipment_1 = require("../../../core/base/equipment");
var item_generator_1 = require("../../../shared/item-generator");
var adventure_log_1 = require("../../../shared/adventure-log");
exports.WEIGHT = 306;
// Get given the opportunity to change items
var FindItem = (function (_super) {
    __extends(FindItem, _super);
    function FindItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FindItem.operateOn = function (player, opts, forceItem) {
        if (opts === void 0) { opts = {}; }
        var item = forceItem;
        if (!forceItem) {
            item = item_generator_1.ItemGenerator.generateItem(null, player.calcLuckBonusFromValue(player.stats.luk), player.level);
            var playerItem = player.equipment[item.type];
            var text = playerItem.score > item.score ? 'weak' : 'strong';
            if (!player.canEquip(item) || item.score <= 0) {
                var message_1 = "%player came across %item, but it was too " + text + " for %himher, so %she sold it for %gold gold.";
                var gold = player.sellItem(item);
                var parsedMessage = this._parseText(message_1, player, { gold: gold, item: item.fullname });
                this.emitMessage({ affected: [player], eventText: parsedMessage, category: adventure_log_1.MessageCategories.ITEM });
                return;
            }
        }
        var id = event_1.Event.chance.guid();
        var message = "Would you like to equip \u00AB" + item.fullname + "\u00BB?";
        var eventText = this.eventText('findItem', player, { item: item.fullname });
        var extraData = { item: item, eventText: eventText };
        player.addChoice({ id: id, message: message, extraData: extraData, event: 'FindItem', choices: ['Yes', 'No'] });
        return [player];
    };
    FindItem.makeChoice = function (player, id, response) {
        if (response !== 'Yes')
            return;
        var choice = _.find(player.choices, { id: id });
        player.equip(new equipment_1.Equipment(choice.extraData.item));
        this.emitMessage({ affected: [player], eventText: choice.extraData.eventText, category: adventure_log_1.MessageCategories.ITEM });
    };
    return FindItem;
}(event_1.Event));
FindItem.WEIGHT = exports.WEIGHT;
exports.FindItem = FindItem;
