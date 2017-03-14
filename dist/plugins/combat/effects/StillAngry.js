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
var StillAngry = (function (_super) {
    __extends(StillAngry, _super);
    function StillAngry() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StillAngry.prototype.affect = function () {
        this.stun = true;
        this.stunMessage = this.origin.name + " is still fuming about the r\u00E9sum\u00E9 that " + this.target.fullname + " turned down!";
    };
    StillAngry.prototype.tick = function () {
        _super.prototype.tick.call(this);
        this.stun = true;
        this.stunMessage = this.origin.name + " is still fuming about the r\u00E9sum\u00E9 that " + this.target.fullname + " turned down!";
    };
    return StillAngry;
}(effect_1.Effect));
exports.StillAngry = StillAngry;
