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
var spell_1 = require("../spell");
var DownloadedRAM_1 = require("../effects/DownloadedRAM");
var DownloadRAM = (function (_super) {
    __extends(DownloadRAM, _super);
    function DownloadRAM() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DownloadRAM.shouldCast = function (caster) {
        return !caster.$effects.hasEffect('DownloadedRAM');
    };
    DownloadRAM.prototype.calcDuration = function () {
        return this.spellPower + 3;
    };
    DownloadRAM.prototype.calcPotency = function () {
        return this.spellPower * 10;
    };
    DownloadRAM.prototype.determineTargets = function () {
        return this.$targetting.self;
    };
    DownloadRAM.prototype.preCast = function () {
        var _this = this;
        var message = '%player downloaded some %spellName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: DownloadedRAM_1.DownloadedRAM,
                targets: [target]
            });
        });
    };
    return DownloadRAM;
}(spell_1.Spell));
DownloadRAM.element = spell_1.SpellType.DIGITAL;
DownloadRAM.stat = 'special';
DownloadRAM.tiers = [
    { name: 'single-channel RAM', spellPower: 1, weight: 40, cost: 32, level: 8, profession: 'Bitomancer' },
    { name: 'dual-channel RAM', spellPower: 2, weight: 40, cost: 64, level: 16, profession: 'Bitomancer' },
    { name: 'triple-channel RAM', spellPower: 3, weight: 40, cost: 128, level: 32, profession: 'Bitomancer' },
    { name: 'quad-channel RAM', spellPower: 4, weight: 40, cost: 256, level: 64, profession: 'Bitomancer' }
];
exports.DownloadRAM = DownloadRAM;
