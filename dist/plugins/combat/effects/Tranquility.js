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
var effect_1 = require("../effect");
// copy-paste because this effect is way more important than a normal DR skill
var Tranquility = (function (_super) {
    __extends(Tranquility, _super);
    function Tranquility() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tranquility.prototype.affect = function (target) {
        this.setStat(target, 'damageReduction', this.potency);
    };
    return Tranquility;
}(effect_1.Effect));
exports.Tranquility = Tranquility;
