
import * as _ from 'lodash';
import { Map } from './map';
import * as fs from 'fs';

import * as Bosses from '../../../assets/maps/content/boss.json';

export class World {
  constructor() {
    this.maps = {};
    this.uniqueRegions = [];

    this.loadAllMaps();
    this.loadAllCollectibles();
  }

  getMapsInFolder(dir) {
    let results = [];

    const list = fs.readdirSync(__dirname + '/../../../' + dir);
    _.each(list, basefilename => {
      const filename = `${dir}/${basefilename}`;
      const stat = fs.statSync(__dirname + '/../../../' + filename);
      if(_.includes(filename, 'promo')) return;

      if(stat && stat.isDirectory()) results = results.concat(this.getMapsInFolder(filename));
      else results.push({ map: basefilename.split('.')[0], path: __dirname + '/../../../' + filename });
    });

    return results;
  }

  loadAllMaps() {
    _.each(this.getMapsInFolder('assets/maps/world-maps'), ({ map, path }) => {
      const mapRef = new Map(path, map);
      this.maps[map] = mapRef;

      this.uniqueRegions.push(..._.uniq(_.compact(mapRef.regions)));
    });
  }

  loadAllCollectibles() {
    this.allCollectibles = {};

    _.each(Bosses, (boss, bossName) => {
      if(!boss.collectibles) return;
      _.each(boss.collectibles, coll => {
        coll.rarity = 'guardian';
        coll.map = 'Boss';
        coll.region = bossName;
        this.allCollectibles[coll.name] = coll;
      });
    });

    _.each(_.values(this.maps), map => {
      _.extend(this.allCollectibles, map.collectibles);
    });
  }
}