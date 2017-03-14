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
var profession_1 = require("../base/profession");
var Trickster = (function (_super) {
    __extends(Trickster, _super);
    function Trickster() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Trickster.str = function (player) { return player.liveStats.luk / 10; };
    Trickster.con = function (player) { return player.liveStats.luk / 10; };
    Trickster.dex = function (player) { return player.liveStats.luk / 10; };
    Trickster.agi = function (player) { return player.liveStats.luk / 10; };
    Trickster.int = function (player) { return player.liveStats.luk / 10; };
    Trickster.setupSpecial = function (target) {
        target._special.name = 'Cards';
        target._special.maximum = 54;
        target._special.toMaximum();
    };
    return Trickster;
}(profession_1.Profession));
Trickster.baseHpPerLevel = profession_1.Profession.baseHpPerLevel;
Trickster.baseMpPerLevel = profession_1.Profession.baseMpPerLevel;
Trickster.baseHpPerCon = 5;
Trickster.baseHpPerLuk = 10;
Trickster.baseMpPerLuk = 10;
Trickster.baseConPerLevel = 1;
Trickster.baseDexPerLevel = 1;
Trickster.baseAgiPerLevel = 1;
Trickster.baseStrPerLevel = 1;
Trickster.baseIntPerLevel = 1;
Trickster.baseLukPerLevel = 5;
exports.Trickster = Trickster;
