
import { Achievement, AchievementTypes } from '../achievement';

export class TempterOfFate extends Achievement {
  static achievementData(player) {

    const totalFates = player.$statistics.getStat('Character.Event.Providence');

    if(totalFates < 100000) return [];

    const baseReward = {
      tier: 1,
      name: 'Tempter of Fate',
      desc: `Gain a special title for ${(100000).toLocaleString()} fate pool uses (AKA: being literally insane).`,
      type: AchievementTypes.EXPLORE,
      rewards: [{
        type: 'title',
        title: 'Tempter of Fate',
        deathMessage: '%player tipped the scales of fate too many times and finally succumbed to it.'
      }, {
        type: 'petattr',
        petattr: 'a crazy hat that instills craziness'
      }]
    };

    if(totalFates >= 1000000) {
      baseReward.rewards.push({
        type: 'title',
        title: 'Fateful Wolf',
        deathMessage: '%player was raised by wolves and died like one.'
      });
    }

    return [baseReward];
  }
}