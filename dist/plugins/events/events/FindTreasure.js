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
var FindItem_1 = require("./FindItem");
var item_generator_1 = require("../../../shared/item-generator");
exports.WEIGHT = -1;
// Find treasure
var FindTreasure = (function (_super) {
    __extends(FindTreasure, _super);
    function FindTreasure() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FindTreasure.operateOn = function (player, _a) {
        var treasureName = _a.treasureName;
        player.$statistics.incrementStat("Character.Treasure." + treasureName);
        _.each(item_generator_1.ItemGenerator.getAllTreasure(treasureName, player), function (item) {
            if (!player.canEquip(item))
                return;
            FindItem_1.FindItem.operateOn(player, null, item);
        });
    };
    return FindTreasure;
}(event_1.Event));
FindTreasure.WEIGHT = exports.WEIGHT;
exports.FindTreasure = FindTreasure;
