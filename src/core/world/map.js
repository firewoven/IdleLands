
import * as _ from 'lodash';

import { SETTINGS } from '../../static/settings';
import { ObjectAssets } from '../../shared/asset-loader';

const gidMap = SETTINGS.gidMap;
const blockers = [16, 17, 3, 33, 37, 38, 39, 44, 45, 46, 47, 50, 53, 54, 55, 56, 57, 81, 83];
// const interactables = [1, 2, 12, 13, 14, 15, 18, 40, 41, 42, 43, 48, 51];

export class Map {
  constructor(path, mapName) {
    this.map = _.cloneDeep(require(`${path}`));

    this.tileHeight = this.map.tileheight;
    this.tileWidth = this.map.tilewidth;

    this.height = this.map.height;
    this.width = this.map.width;

    if(this.map && this.map.properties) {
      this.name = this.map.properties.name;
    }
    this.path = path.split('assets/maps/world-maps/')[1];
    this.mapName = mapName;

    this.nameTrainers();
    this.loadRegions();
    this.loadCollectibles();
  }

  loadCollectibles() {
    this.collectibles = {};
    _.each(this.map.layers[2].objects, object => {
      if(object.type !== 'Collectible') return;
      this.collectibles[object.name] = object.properties;
      if(!object.properties.rarity) object.properties.rarity = 'basic';
      object.properties.description = object.properties.flavorText;
      object.properties.map = this.mapName;
      object.properties.region = this.regions[((object.y/16)*this.width)+(object.x/16)] || 'Wilderness';
    });
  }

  loadRegions() {
    this.regions = [];

    if(!this.map.layers[3]) return;

    _.each(this.map.layers[3].objects, region => {

      const startX = region.x / 16;
      const startY = region.y / 16;
      const width = region.width / 16;
      const height = region.height / 16;

      for(let x = startX; x < startX+width; x++) {
        for(let y = startY; y < startY+height; y++) {
          this.regions[(y*this.width)+x] = region.name;
        }
      }
    });
  }

  nameTrainers() {
    const allTrainers = _.filter(this.map.layers[2].objects, obj => obj.type === 'Trainer');
    _.each(allTrainers, trainer => {
      const validNames = _.reject(ObjectAssets.trainer, npc => npc.class && npc.class !== trainer.name);
      trainer.properties = trainer.properties || {};
      trainer.properties.realName = _.sample(validNames).name;
    });
  }

  // layers[0] will always be the terrain
  // layers[1] will always be the blocking tiles
  // layers[2] will always be the interactable stuff
  // layers[3] will always be map regions, where applicable
  getTile(x, y) {
    const tilePosition = (y*this.width) + x;
    const tileObject = _.find(this.map.layers[2].objects, { x: this.tileWidth*x, y: this.tileHeight*(y+1) });

    return {
      terrain: gidMap[this.map.layers[0].data[tilePosition]] || 'Void',
      blocked: _.includes(blockers, this.map.layers[1].data[tilePosition]),
      blocker: gidMap[this.map.layers[1].data[tilePosition]],
      region: this.regions[tilePosition] || 'Wilderness',
      object: tileObject,
      path: this.path
    };
  }
}
