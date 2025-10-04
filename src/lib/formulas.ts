import type { Monster, Task, TaskPriority, User } from '../types/core';

/**
 * Precision helper rounding numeric results to two decimal places.
 */
const roundToTwo = (value: number): number => Math.round(value * 100) / 100;

const PRIORITY_MULTIPLIER: Record<TaskPriority, number> = {
  0.1: 0.5,
  1: 1,
  1.5: 1.5,
  2: 2,
};

/**
 * Computes the experience required to advance from the provided level
 * to the next one. The curve mirrors the original Habitica progression
 * which gently increases the requirement at higher levels while keeping
 * the early game approachable.
 *
 * @param level - Current player level. Negative values are treated as 0.
 * @returns Required experience rounded to the nearest whole point.
 */
export const xpNeededForLevel = (level: number): number => {
  const normalizedLevel = Math.max(1, Math.floor(level));
  const xp = 0.25 * Math.pow(normalizedLevel - 1, 2) + 10 * (normalizedLevel - 1) + 139.75;
  return Math.round(xp);
};

/**
 * Calculates the gold and experience awarded for completing a task.
 * The formula balances task priority, player attribute bonuses and the
 * current task value which drifts according to repeated completions.
 *
 * @param task - The task that was completed.
 * @param user - The user receiving the reward.
 * @returns An object containing gold and experience rewards rounded to cents.
 */
export const taskRewards = (task: Task, user: User): { gold: number; experience: number } => {
  const priorityMultiplier = PRIORITY_MULTIPLIER[task.priority] ?? 1;
  const attributeValue = user.stats[task.attribute];
  const attributeMultiplier = 1 + attributeValue / 200;
  const streakModifier = 1 + Math.max(0, task.streak ?? 0) * 0.02;
  const difficultyModifier = Math.exp(-Math.min(5, Math.max(-5, task.value)) / 10);

  const baseExperience = 10;
  const baseGold = 1.5;

  const experience = roundToTwo(baseExperience * priorityMultiplier * attributeMultiplier * streakModifier * difficultyModifier);
  const gold = roundToTwo(baseGold * priorityMultiplier * attributeMultiplier * streakModifier * difficultyModifier);

  return { gold, experience };
};

/**
 * Computes the amount of damage a user receives when failing a task or
 * daily. Constitution mitigates incoming damage while the task's value
 * and priority increase the penalty for repeated neglect.
 *
 * @param task - The failed task.
 * @param user - The user receiving damage.
 * @returns Damage rounded to two decimal places.
 */
export const damageTaken = (task: Task, user: User): number => {
  const priorityMultiplier = PRIORITY_MULTIPLIER[task.priority] ?? 1;
  const taskPenalty = 1 + Math.max(0, -(task.value)) / 5;
  const conMitigation = 1 - Math.min(0.6, user.stats.con / 200);
  const streakPenalty = 1 + Math.max(0, (task.streak ?? 0)) * 0.05;

  const baseDamage = task.type === 'daily' ? 10 : task.type === 'habit' ? 6 : 5;
  const damage = baseDamage * priorityMultiplier * taskPenalty * streakPenalty * conMitigation;

  return roundToTwo(Math.max(0, damage));
};

/**
 * Estimates the amount of health damage a player inflicts upon a quest
 * boss. Strength and perception contribute to the offensive score while
 * monster defense reduces the final amount.
 *
 * @param user - The attacking player.
 * @param monster - The monster targeted by the attack.
 * @returns Damage dealt rounded to two decimal places.
 */
export const playerDamage = (user: User, monster: Monster): number => {
  const offensiveScore = user.stats.str * 0.65 + user.stats.per * 0.35 + user.stats.lvl * 1.5;
  const equipmentBonus = Object.values(user.items.equipment ?? {}).reduce((total, item) => {
    if (!item?.bonuses) return total;
    const { str = 0, per = 0 } = item.bonuses;
    return total + str * 0.5 + per * 0.25;
  }, 0);

  const rawDamage = offensiveScore + equipmentBonus;
  const mitigatedDamage = rawDamage * (1 - Math.min(0.7, monster.defense / 200));
  const levelScaling = 1 + Math.max(0, user.stats.lvl - 1) / 50;

  return roundToTwo(Math.max(0, mitigatedDamage * levelScaling));
};
