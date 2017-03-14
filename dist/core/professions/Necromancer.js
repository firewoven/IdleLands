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
var Necromancer = (function (_super) {
    __extends(Necromancer, _super);
    function Necromancer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Necromancer.setupSpecial = function (target) {
        target._special.name = 'Minions';
        target._special.set(0);
        target._special.maximum = Math.floor(target.level / 25) + 1;
    };
    return Necromancer;
}(profession_1.Profession));
Necromancer.baseHpPerLevel = profession_1.Profession.baseHpPerLevel - 180;
Necromancer.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 60;
Necromancer.baseMpPerInt = 72;
Necromancer.baseHpPerCon = 42;
Necromancer.baseConPerLevel = 1;
Necromancer.baseDexPerLevel = 3;
Necromancer.baseAgiPerLevel = -3;
Necromancer.baseStrPerLevel = 3;
Necromancer.baseIntPerLevel = 8;
Necromancer.baseLukPerLevel = -1;
Necromancer.classStats = {
    mpregen: function (target) { return target._mp.maximum * 0.02; },
    agi: function (target, baseValue) { return -baseValue * 0.1; },
    con: function (target, baseValue) { return -baseValue * 0.25; },
    prone: 1,
    venom: 1,
    poison: 1,
    vampire: 1
};
exports.Necromancer = Necromancer;
