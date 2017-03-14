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
var RelentlessAssault = (function (_super) {
    __extends(RelentlessAssault, _super);
    function RelentlessAssault() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RelentlessAssault.prototype.tick = function () {
        _super.prototype.tick.call(this);
        this.target.$battle.doAttack(this.target, 'Attack');
        this.target.$battle.doAttack(this.target, 'Attack');
        this.target._special.sub(25);
        if (this.target._special.atMinimum())
            this.duration = 0;
    };
    return RelentlessAssault;
}(effect_1.Effect));
exports.RelentlessAssault = RelentlessAssault;
