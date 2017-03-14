"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var constitute_1 = require("constitute");
var festivals_db_1 = require("./festivals.db");
var festival_1 = require("./festival");
var mongodb_1 = require("mongodb");
var node_schedule_1 = require("node-schedule");
var send_system_message_1 = require("../../shared/send-system-message");
var Festivals = (function () {
    function Festivals(festivalsDb) {
        this.festivalsDb = festivalsDb;
        this.festivals = [];
        this.init();
    }
    Festivals.prototype.init = function () {
        var _this = this;
        this.festivalsDb.getFestivals()
            .then(function (festivals) {
            _this.festivals = festivals || [];
            _.each(festivals, function (festival) {
                _this.setExpiryTimerForFestival(festival);
            });
        });
    };
    Festivals.prototype.hasFestival = function (playerName) {
        return _.find(this.festivals, { startedBy: playerName });
    };
    Festivals.prototype.addFestival = function (festival, insertIntoDb) {
        if (_.find(this.festivals, { name: festival.name }))
            return;
        if (festival.message) {
            send_system_message_1.sendSystemMessage(festival.message);
        }
        festival = new festival_1.Festival(festival);
        if (insertIntoDb) {
            this.festivalsDb.saveFestival(festival);
        }
        this.festivals.push(festival);
    };
    Festivals.prototype.removeFestivalById = function (festivalId) {
        var festival = _.find(this.festivals, { _id: mongodb_1.ObjectId(festivalId) });
        if (!festival)
            return;
        this._removeFestival(festival);
    };
    Festivals.prototype._removeFestival = function (festival) {
        this.festivals = _.without(this.festivals, festival);
        send_system_message_1.sendSystemMessage(festival.name + " is now over!");
        this.festivalsDb.removeFestival(festival);
    };
    Festivals.prototype.setExpiryTimerForFestival = function (festival) {
        var _this = this;
        if (festival.endDate < Date.now()) {
            this._removeFestival(festival);
            return;
        }
        node_schedule_1.scheduleJob(festival.endDate, function () {
            _this._removeFestival(festival);
        });
    };
    return Festivals;
}());
Festivals = __decorate([
    constitute_1.Dependencies(festivals_db_1.FestivalsDb),
    __metadata("design:paramtypes", [Object])
], Festivals);
exports.Festivals = Festivals;
