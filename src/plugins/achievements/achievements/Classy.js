
import * as _ from 'lodash';

import { Achievement, AchievementTypes } from '../achievement';

import * as Professions from '../../../core/professions/_all';

const allStats = ['Con', 'Dex', 'Agi', 'Str', 'Int', 'Luk'];

export class Classy extends Achievement {
  static achievementData(player) {

    const allProfessionsBeen = player.$statistics.getStat('Character.Professions');

    return _.flatten(_.map(allProfessionsBeen, (times, prof) => {

      const statReward = {
        type: 'stats'
      };

      _.each(allStats, stat => {
        const profStat = Professions[prof][`base${stat}PerLevel`];
        if(!profStat) return;
        statReward[stat] = profStat;
      });

      const baseAchievements = [{
        tier: 1,
        name: `Classy: ${prof}`,
        desc: `You've been a ${prof}. Gain their base stats as a bonus!`,
        type: AchievementTypes.PROGRESS,
        rewards: [statReward]
      }];

      const tiers = [
        { required: 5,    tier: 1, title: 'Trainee', bonusRewards: { type: 'petclass', petclass: prof } },
        { required: 15,   tier: 2, title: 'Student' },
        { required: 25,   tier: 3, title: 'Skilled' },
        { required: 50,   tier: 4, title: 'Master' },
        { required: 100,  tier: 5, title: 'Grandmaster' }
      ];

      const professionalAchievement = {
        name: `Professional: ${prof}`,
        type: AchievementTypes.PROGRESS,
        rewards: []
      };

      let topMax = 0;

      _.each(tiers, ({ required, tier, title, bonusRewards }) => {
        if(times < required) return;

        const statReward = {
          type: 'stats'
        };

        _.each(allStats, stat => {
          const profStat = Professions[prof][`base${stat}PerLevel`] * required;
          if(!profStat) return;
          statReward[stat] = profStat;
        });

        professionalAchievement.rewards.push(statReward);

        professionalAchievement.rewards.push({ type: 'title', title: `${title} ${prof}` });
        if(bonusRewards) {
          professionalAchievement.rewards.push(bonusRewards);
        }

        topMax = required;
        professionalAchievement.tier = tier;
      });

      if(professionalAchievement.rewards.length > 0) {
        professionalAchievement.desc = `You've been a ${prof} ${topMax} times. Get title(s) and stats for it!`;
        baseAchievements.push(professionalAchievement);
      }

      return baseAchievements;
    }));
  }
}