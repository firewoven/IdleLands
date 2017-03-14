"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var stat_calculator_1 = require("../../shared/stat-calculator");
var Generator = (function () {
    function Generator() {
    }
    Generator.mergePropInto = function (baseItem, prop, handleName) {
        if (handleName === void 0) { handleName = true; }
        if (!prop)
            return;
        if (handleName) {
            if (prop.type === 'suffix') {
                baseItem.name = baseItem.name + " of the " + prop.name;
            }
            else {
                baseItem.name = prop.name + " " + baseItem.name;
            }
        }
        _.each(prop, function (val, attr) {
            if (!_.isNumber(val) || _.isEmpty(attr))
                return;
            if (baseItem[attr]) {
                baseItem[attr] += prop[attr];
            }
            else {
                baseItem[attr] = _.isNaN(prop[attr]) ? true : prop[attr];
            }
        });
        baseItem.name = _.trim(baseItem.name);
    };
    return Generator;
}());
Generator.types = ['body', 'charm', 'feet', 'finger', 'hands', 'head', 'legs', 'neck', 'mainhand', 'offhand'];
Generator.stats = stat_calculator_1.ALL_STATS;
exports.Generator = Generator;
