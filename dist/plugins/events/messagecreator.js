// TODO: https://github.com/IdleLands/IdleLandsOld/blob/e460f87751ddfe370f8e99b46d4838af5688b93b/src/system/handlers/MessageCreator.coffee
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Chance = require("chance");
var chance = new Chance();
var game_state_1 = require("../../core/game-state");
var asset_loader_1 = require("../../shared/asset-loader");
var logger_1 = require("../../shared/logger");
var AllDomains = (function () {
    function AllDomains() {
    }
    AllDomains.dict = function (props) {
        var funct = props[0].funct;
        var normalizedFunct = funct.toLowerCase();
        var isPlural = false;
        if (normalizedFunct === 'nouns') {
            isPlural = true;
            normalizedFunct = 'noun';
        }
        var canLowercase = !_.includes(['deity'], normalizedFunct);
        var chosenItem = _.sample(asset_loader_1.StringAssets[normalizedFunct]);
        if (canLowercase) {
            chosenItem = normalizedFunct === funct ? chosenItem.toLowerCase() : _.capitalize(chosenItem);
        }
        if (normalizedFunct === 'noun' && !isPlural) {
            chosenItem = chosenItem.substring(0, chosenItem.length - 1); // supposedly, all nouns are plural
        }
        return chosenItem;
    };
    AllDomains.placeholder = function () {
        return this.dict([{ funct: 'placeholder' }]);
    };
    AllDomains.chance = function (props) {
        var _a = props[0], funct = _a.funct, args = _a.args;
        if (!chance[funct])
            return this.placeholder();
        return chance[funct](args);
    };
    AllDomains.party = function (props, cache, partyData) {
        var _a = props[0], funct = _a.funct, cacheNum = _a.cacheNum;
        if (funct === 'member') {
            return partyData.players[cacheNum].fullname;
        }
        return this.placeholder();
    };
    AllDomains.combat = function (props, cache, combatData) {
        var _a = props[0], funct = _a.funct, cacheNum = _a.cacheNum;
        if (props[1]) {
            return this.party([props[1]], cache, combatData.parties[cacheNum]);
        }
        if (funct === 'party') {
            return combatData.parties[cacheNum].name;
        }
        return this.placeholder();
    };
    AllDomains.random = function (props, cache) {
        var _a = props[0], domain = _a.domain, funct = _a.funct, cacheNum = _a.cacheNum, args = _a.args;
        var got = cache.get(domain, funct, cacheNum);
        if (got)
            return got;
        var res = AssetDomainHandler[funct](args, props, cache);
        cache.set(domain, funct, cacheNum, res);
        return res;
    };
    return AllDomains;
}());
var AssetDomainHandler = (function () {
    function AssetDomainHandler() {
    }
    AssetDomainHandler.town = function () {
        return _.sample(_.filter(game_state_1.GameState.getInstance().world.uniqueRegions, function (r) { return _.includes(r, 'Town'); }));
    };
    AssetDomainHandler.class = function () {
        return _.sample(asset_loader_1.StringAssets.class);
    };
    AssetDomainHandler.player = function () {
        return _.sample(game_state_1.GameState.getInstance().players).fullname;
    };
    AssetDomainHandler.map = function () {
        return _.sample(_.keys(game_state_1.GameState.getInstance().world.maps));
    };
    AssetDomainHandler.pet = function () {
        var player = _.sample(game_state_1.GameState.getInstance().players);
        var pet = _.sample(player.$pets.$pets);
        return pet ? pet.fullname : AllDomains.placeholder();
    };
    AssetDomainHandler.activePet = function () {
        var player = _.sample(game_state_1.GameState.getInstance().players);
        var pet = player.activePet;
        return pet ? pet.fullname : AllDomains.placeholder();
    };
    AssetDomainHandler.guild = function () {
        return AllDomains.placeholder();
    };
    AssetDomainHandler.item = function () {
        return _.sample(_.values(_.sample(game_state_1.GameState.getInstance().players).equipment)).fullname;
    };
    AssetDomainHandler.monster = function () {
        return _.sample(asset_loader_1.ObjectAssets.monster).name;
    };
    AssetDomainHandler.ingredient = function () {
        return _.sample(asset_loader_1.ObjectAssets[_.sample(['veg', 'meat', 'bread'])]).name;
    };
    AssetDomainHandler.party = function () {
        var party = _.sample(_.values(game_state_1.GameState.getInstance().parties));
        if (party)
            return party.name;
        return AllDomains.placeholder();
    };
    return AssetDomainHandler;
}());
var PlayerOwnedDomainHandler = (function () {
    function PlayerOwnedDomainHandler() {
    }
    PlayerOwnedDomainHandler.pet = function () {
        return AllDomains.placeholder();
    };
    PlayerOwnedDomainHandler.guild = function () {
        return AllDomains.placeholder();
    };
    PlayerOwnedDomainHandler.guildMember = function () {
        return AllDomains.placeholder();
    };
    return PlayerOwnedDomainHandler;
}());
var EventVariableCache = (function () {
    function EventVariableCache() {
        this.cache = {};
    }
    EventVariableCache.prototype.get = function (domain, funct, num) {
        if (_.isNaN(num))
            throw new Error('Cache:get num cannot be NaN');
        return _.get(this.cache, domain + "." + funct + "." + num);
    };
    EventVariableCache.prototype.set = function (domain, funct, num, val) {
        if (_.isNaN(num))
            throw new Error('Cache:set num cannot be NaN');
        _.set(this.cache, domain + "." + funct + "." + num, val);
    };
    return EventVariableCache;
}());
var EventVariableManager = (function () {
    function EventVariableManager() {
    }
    EventVariableManager.transformVarProps = function (props, cache, eventData) {
        var _a = props[0], domain = _a.domain, funct = _a.funct, cacheNum = _a.cacheNum;
        var retVal = null;
        try {
            var prevCacheData = cache.get(domain, funct, cacheNum);
            if (prevCacheData && funct !== 'party')
                return prevCacheData;
            retVal = "\u00AB" + AllDomains[domain](props, cache, eventData) + "\u00BB";
            if (funct !== 'party')
                cache.set(domain, funct, cacheNum, retVal);
        }
        catch (e) {
            logger_1.Logger.error('EventVariableManager', e, { props: props, cache: cache });
        }
        return retVal;
    };
    EventVariableManager.getVarProps = function (string) {
        var terms = string.split(' ');
        var varProps = [];
        _.each(terms, function (term) {
            var _a = term.split('#'), props = _a[0], cacheNum = _a[1];
            var _b = props.split(':', 2), domain = _b[0], funct = _b[1];
            var args = props.substring(1 + funct.length + props.indexOf(funct)).trim().split('\'').join('"');
            try {
                varProps.push({
                    domain: domain,
                    funct: funct,
                    cacheNum: cacheNum ? +cacheNum : 0,
                    args: args ? JSON.parse(args) : null
                });
            }
            catch (e) {
                logger_1.Logger.error('MessageCreator', e, { string: string });
            }
        });
        return varProps;
    };
    EventVariableManager.handleVariables = function (string, eventData) {
        var _this = this;
        if (eventData === void 0) { eventData = {}; }
        var cache = new EventVariableCache();
        return string.replace(/\$([a-zA-Z\:#0-9 {}_,']+)\$/g, function (match, p1) {
            var string = _this.getVarProps(p1);
            string = _this.transformVarProps(string, cache, eventData);
            return string;
        });
    };
    return EventVariableManager;
}());
var MessageParser = (function () {
    function MessageParser() {
    }
    MessageParser.genderPronoun = function (gender, replace) {
        switch (replace) {
            case '%hisher': {
                switch (gender) {
                    case 'male': return 'his';
                    case 'female': return 'her';
                    default: return 'their';
                }
            }
            case '%hishers': {
                switch (gender) {
                    case 'male': return 'his';
                    case 'female': return 'hers';
                    default: return 'theirs';
                }
            }
            case '%himher': {
                switch (gender) {
                    case 'male': return 'him';
                    case 'female': return 'her';
                    default: return 'them';
                }
            }
            case '%she':
            case '%heshe': {
                switch (gender) {
                    case 'male': return 'he';
                    case 'female': return 'she';
                    default: return 'they';
                }
            }
        }
    };
    MessageParser.stringFormat = function (string, player, extra) {
        var _this = this;
        if (extra === void 0) { extra = {}; }
        if (!player)
            return string;
        string = _.trim(string);
        if (extra.item)
            extra.item = "\u00AB" + extra.item + "\u00BB";
        if (extra.partyName)
            extra.partyName = "\u00AB" + extra.partyName + "\u00BB";
        if (extra.spellName)
            extra.spellName = "\u00AB" + extra.spellName + "\u00BB";
        if (extra.weaponName)
            extra.weaponName = "\u00AB" + extra.weaponName + "\u00BB";
        if (extra.targetName)
            extra.targetName = "\u00AB" + extra.targetName + "\u00BB";
        if (extra.casterName)
            extra.casterName = "\u00AB" + extra.casterName + "\u00BB";
        if (extra.deflectItem)
            extra.deflectItem = "\u00AB" + extra.deflectItem + "\u00BB";
        if (extra.collectible)
            extra.collectible = "\u00AB" + extra.collectible + "\u00BB";
        _.each(_.keys(extra), function (key) {
            string = string.split("%" + key).join(_.isNumber(extra[key]) ? extra[key].toLocaleString() : extra[key]);
        });
        string = EventVariableManager.handleVariables(string, extra._eventData);
        var splitJoins = [
            { split: '%player', join: function () { return "\u00AB" + player.fullname + "\u00BB"; } },
            { split: '%pet', join: function () { return "\u00AB" + PlayerOwnedDomainHandler.pet(player) + "\u00BB"; } },
            { split: '%guildMember', join: function () { return "\u00AB" + PlayerOwnedDomainHandler.guildMember(player) + "\u00BB"; } },
            { split: '%guild', join: function () { return "\u00AB" + PlayerOwnedDomainHandler.guild(player) + "\u00BB"; } }
        ];
        _.each(['hishers', 'hisher', 'himher', 'she', 'heshe'], function (pronoun) {
            splitJoins.push({
                split: "%" + pronoun,
                join: function () { return _this.genderPronoun(player.gender, "%" + pronoun); }
            });
            splitJoins.push({
                split: "%" + _.capitalize(pronoun),
                join: function () { return _.capitalize(_this.genderPronoun(player.gender, "%" + pronoun)); }
            });
        });
        _.each(splitJoins, function (sj) {
            if (!_.includes(string, sj.split))
                return;
            string = string.split(sj.split).join(sj.join());
        });
        return string;
    };
    return MessageParser;
}());
exports.MessageParser = MessageParser;
