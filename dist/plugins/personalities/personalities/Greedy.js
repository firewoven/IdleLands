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
var personality_1 = require("../personality");
var Greedy = (function (_super) {
    __extends(Greedy, _super);
    function Greedy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Greedy.disable = function (player) {
        _super.disable.call(this, player);
        this.flagDirty(player, ['xp', 'gold']);
    };
    Greedy.enable = function (player) {
        _super.enable.call(this, player);
        this.flagDirty(player, ['xp', 'gold']);
    };
    Greedy.hasEarned = function (player) {
        return player.$statistics.getStat('Character.Gold.Gain') >= 100000;
    };
    return Greedy;
}(personality_1.Personality));
Greedy.disableOnActivate = ['Seeker'];
Greedy.description = 'Gain more gold, but gain less xp.';
Greedy.stats = {
    xp: function (player, baseValue) { return -baseValue * 0.15; },
    gold: function (player, baseValue) { return baseValue * 0.15; }
};
exports.Greedy = Greedy;
