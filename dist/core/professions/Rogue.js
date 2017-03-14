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
var Rogue = (function (_super) {
    __extends(Rogue, _super);
    function Rogue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rogue.setupSpecial = function (target) {
        target._special.name = 'Stamina';
        target._special.maximum = 100;
        target._special.toMaximum();
        this.resetSkillCombo(target);
    };
    Rogue._eventSelfTakeTurn = function (target) {
        target._special.add(2);
        if (target.$lastComboSkillTurn > 0)
            target.$lastComboSkillTurn--;
    };
    Rogue.updateSkillCombo = function (target, skillName) {
        target.$lastComboSkill = skillName;
        target.$lastComboSkillTurn = 4;
    };
    Rogue.resetSkillCombo = function (target) {
        target.$lastComboSkill = null;
        target.$lastComboSkillTurn = 0;
    };
    return Rogue;
}(profession_1.Profession));
Rogue.baseHpPerLevel = profession_1.Profession.baseHpPerLevel - 30;
Rogue.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 30;
Rogue.baseHpPerDex = 6;
Rogue.baseMpPerDex = 6;
Rogue.baseConPerLevel = 2;
Rogue.baseDexPerLevel = 4;
Rogue.baseAgiPerLevel = 4;
Rogue.baseStrPerLevel = 2;
Rogue.baseIntPerLevel = 1;
Rogue.classStats = {
    poison: 1,
    venom: 1,
    shatter: 1,
    vampire: 1,
    prone: 1
};
exports.Rogue = Rogue;
