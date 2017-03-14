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
var character_1 = require("../../core/base/character");
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Monster.prototype.init = function (opts) {
        opts.levelSet = opts.level;
        delete opts.level;
        opts.hpBoost = opts.hp;
        delete opts.hp;
        opts.mpBoost = opts.mp;
        delete opts.mp;
        this.gold = Math.round(Math.random() * 10000);
        _super.prototype.init.call(this, opts);
    };
    return Monster;
}(character_1.Character));
exports.Monster = Monster;
