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
var Jester = (function (_super) {
    __extends(Jester, _super);
    function Jester() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Jester.str = function (player) { return player.liveStats.luk / 5; };
    Jester.con = function (player) { return player.liveStats.luk / 5; };
    Jester.dex = function (player) { return player.liveStats.luk / 5; };
    Jester.agi = function (player) { return player.liveStats.luk / 5; };
    Jester.int = function (player) { return player.liveStats.luk / 5; };
    return Jester;
}(profession_1.Profession));
Jester.baseHpPerLevel = profession_1.Profession.baseHpPerLevel;
Jester.baseMpPerLevel = profession_1.Profession.baseMpPerLevel;
Jester.baseHpPerCon = 0;
Jester.baseHpPerLuk = 30;
Jester.baseMpPerLuk = 30;
Jester.baseConPerLevel = 0;
Jester.baseDexPerLevel = 0;
Jester.baseAgiPerLevel = 0;
Jester.baseStrPerLevel = 0;
Jester.baseIntPerLevel = 0;
Jester.baseLukPerLevel = 10;
exports.Jester = Jester;
