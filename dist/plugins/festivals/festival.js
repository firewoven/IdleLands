"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Festival = (function () {
    function Festival(opts) {
        if (opts.hourDuration) {
            var date = new Date();
            date.setHours(date.getHours() + opts.hourDuration);
            opts.endDate = date;
        }
        this.endDate = opts.endDate;
        this.name = opts.name;
        this.bonuses = opts.bonuses || {}; // { stat: multiplier }
        this.startedBy = opts.startedBy;
    }
    return Festival;
}());
exports.Festival = Festival;
