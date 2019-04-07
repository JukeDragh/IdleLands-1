
import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { get, compact, flatten, sortBy } from 'lodash';

import { PlayerOwned } from './PlayerOwned';
import { IAchievement, AchievementRewardType } from '../../interfaces';

@Entity()
export class Achievements extends PlayerOwned {

  // internal vars
  @ObjectIdColumn() public _id: string;

  @Column()
  private achievements: { [key: string]: IAchievement };

  public get $achievementsData() {
    return { achievements: this.achievements };
  }

  constructor() {
    super();
    if(!this.achievements) this.achievements = {};
  }

  public add(ach: IAchievement): void {
    this.achievements[ach.name] = ach;
  }

  public getAchievementAchieved(achName: string): number {
    return get(this.achievements, [achName, 'achievedAt'], 0);
  }

  public getAchievementTier(achName: string): number {
    return get(this.achievements, [achName, 'tier'], 0);
  }

  public resetAchievementsTo(ach: IAchievement[]): void {
    this.achievements = {};

    ach.forEach(achi => this.add(achi));
  }

  public getTitles(): string[] {
    return sortBy(flatten(Object.values(this.achievements).map(ach => {
        return compact(
          ach.rewards
            .filter(reward => reward.type === AchievementRewardType.Title)
            .map(reward => reward.title)
        );
      })));
  }

  public getPersonalities(): string[] {
    return sortBy(flatten(Object.values(this.achievements).map(ach => {
        return compact(
          ach.rewards
            .filter(reward => reward.type === AchievementRewardType.Personality)
            .map(reward => reward.personality)
        );
      })));
  }

  public getGenders(): string[] {
    return ['male', 'female', 'not a bear', 'glowcloud', 'astronomical entity', 'soap'];
  }

}
