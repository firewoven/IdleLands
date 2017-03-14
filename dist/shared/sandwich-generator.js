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
var Chance = require("chance");
var chance = new Chance();
var generator_1 = require("../core/base/generator");
var equipment_1 = require("../core/base/equipment");
var asset_loader_1 = require("../shared/asset-loader");
var SandwichGenerator = (function (_super) {
    __extends(SandwichGenerator, _super);
    function SandwichGenerator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SandwichGenerator.generateSandwich = function (target) {
        var baseItem = _.sample(asset_loader_1.ObjectAssets.bread);
        var itemInst = new equipment_1.Equipment(baseItem);
        itemInst.type = 'sandwich';
        var meat = _.sample(asset_loader_1.ObjectAssets.meat);
        this.mergePropInto(itemInst, meat, false);
        itemInst.name = meat.name + " on " + itemInst.name;
        if (chance.bool({ likelihood: 33 })) {
            var veg = _.sample(asset_loader_1.ObjectAssets.veg);
            this.mergePropInto(itemInst, veg, false);
            itemInst.name = veg.name + " and " + itemInst.name;
        }
        var inches = 3;
        if (target.isPlayer) {
            if (target.gold > 10000)
                inches = 12;
            else
                inches = 6;
        }
        else {
            inches = chance.bool({ likelihood: 50 }) ? 6 : 12;
        }
        itemInst.name = inches + "-in " + itemInst.name;
        return this.cleanUpItem(itemInst);
    };
    SandwichGenerator.cleanUpItem = function (item) {
        _.each(item, function (val, attr) {
            if (_.isNaN(val))
                item[attr] = true;
        });
        return item;
    };
    return SandwichGenerator;
}(generator_1.Generator));
exports.SandwichGenerator = SandwichGenerator;
