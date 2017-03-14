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
var Seeker = (function (_super) {
    __extends(Seeker, _super);
    function Seeker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Seeker.disable = function (player) {
        _super.disable.call(this, player);
        this.flagDirty(player, ['xp', 'gold']);
    };
    Seeker.enable = function (player) {
        _super.enable.call(this, player);
        this.flagDirty(player, ['xp', 'gold']);
    };
    Seeker.hasEarned = function (player) {
        return player.$statistics.getStat('Character.XP.Gain') >= 100000;
    };
    return Seeker;
}(personality_1.Personality));
Seeker.disableOnActivate = ['Greedy'];
Seeker.description = 'Gain more xp, but gain less gold.';
Seeker.stats = {
    xp: function (player, baseValue) { return baseValue * 0.15; },
    gold: function (player, baseValue) { return -baseValue * 0.15; }
};
exports.Seeker = Seeker;
