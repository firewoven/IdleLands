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
var effect_1 = require("../effect");
var PhysicalStatBoost = (function (_super) {
    __extends(PhysicalStatBoost, _super);
    function PhysicalStatBoost() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PhysicalStatBoost.prototype.affect = function (target) {
        var _this = this;
        _.each(['str', 'dex', 'agi'], function (stat) {
            _this.setStat(target, stat, _this.statByPercent(target, stat, _this.potency));
        });
    };
    return PhysicalStatBoost;
}(effect_1.Effect));
exports.PhysicalStatBoost = PhysicalStatBoost;
