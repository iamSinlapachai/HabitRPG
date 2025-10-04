export const TASK_VALUE_FLOOR = -47.27;
export const TASK_VALUE_CEILING = 21.27;

const MIN_TAVERN_DAMAGE = 0.1;
const BASE_CRITICAL_CHANCE = 0.05;
const MAX_CRITICAL_CHANCE = 0.75;
const BASE_CRITICAL_MULTIPLIER = 1.5;
const STAT_CRITICAL_DIVISOR = 200;
const DROP_BASE_CHANCE = 0.3;
const DROP_VALUE_DIVISOR = 60;
const DROP_PERCEPTION_DIVISOR = 200;

function toFinite(value: number): number {
  if (!Number.isFinite(value) || Number.isNaN(value)) {
    return 0;
  }

  return value;
}

export function clampTaskValue(value: number): number {
  const finite = toFinite(value);

  if (finite < TASK_VALUE_FLOOR) {
    return TASK_VALUE_FLOOR;
  }

  if (finite > TASK_VALUE_CEILING) {
    return TASK_VALUE_CEILING;
  }

  return finite;
}

export function getCriticalChance(strength: number): number {
  const safeStrength = Math.max(0, toFinite(strength));
  const chance = BASE_CRITICAL_CHANCE + safeStrength / (STAT_CRITICAL_DIVISOR * 2);

  return Math.min(MAX_CRITICAL_CHANCE, Number(chance.toFixed(3)));
}

export function getCriticalMultiplier(strength: number): number {
  const safeStrength = Math.max(0, toFinite(strength));
  const multiplier = BASE_CRITICAL_MULTIPLIER + safeStrength / STAT_CRITICAL_DIVISOR;

  return Number(multiplier.toFixed(2));
}

export function taskValueToTavernDamage(taskValue: number): number {
  const clamped = clampTaskValue(taskValue);

  if (clamped >= 0) {
    return MIN_TAVERN_DAMAGE;
  }

  const damage = Math.max(MIN_TAVERN_DAMAGE, -clamped * 0.25);
  return Number(damage.toFixed(2));
}

export function taskValueToBossDamage(
  taskValue: number,
  strength: number,
  bossDefense = 0,
): number {
  const clamped = Math.max(0, clampTaskValue(taskValue));
  if (clamped === 0) {
    return 0;
  }

  const safeStrength = Math.max(0, toFinite(strength));
  const attackMultiplier = 1 + safeStrength / STAT_CRITICAL_DIVISOR;
  const baseDamage = clamped * attackMultiplier;
  const mitigated = baseDamage - Math.max(0, toFinite(bossDefense)) / 100;

  return Number(Math.max(0, mitigated).toFixed(2));
}

interface RewardOptions {
  isCritical?: boolean;
  baseMultiplier?: number;
}

function taskValueToReward(
  taskValue: number,
  attribute: number,
  { isCritical = false, baseMultiplier = 1 }: RewardOptions = {},
): number {
  const clamped = Math.max(0, clampTaskValue(taskValue));
  if (clamped === 0) {
    return 0;
  }

  const safeAttribute = Math.max(0, toFinite(attribute));
  const attributeMultiplier = 1 + safeAttribute / 100;
  let reward = clamped * baseMultiplier * attributeMultiplier;

  if (isCritical) {
    reward *= getCriticalMultiplier(safeAttribute);
  }

  return Number(reward.toFixed(2));
}

export function taskValueToExperience(
  taskValue: number,
  intelligence: number,
  options?: RewardOptions,
): number {
  return taskValueToReward(taskValue, intelligence, {
    baseMultiplier: 0.6,
    ...options,
  });
}

export function taskValueToGold(
  taskValue: number,
  perception: number,
  options?: RewardOptions,
): number {
  return taskValueToReward(taskValue, perception, {
    baseMultiplier: 0.4,
    ...options,
  });
}

export function taskValueToDropRate(taskValue: number, perception: number): number {
  const clamped = Math.max(0, clampTaskValue(taskValue));
  const safePerception = Math.max(0, toFinite(perception));

  const chance =
    DROP_BASE_CHANCE + clamped / DROP_VALUE_DIVISOR + safePerception / DROP_PERCEPTION_DIVISOR;

  return Number(Math.min(0.9, chance).toFixed(3));
}
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
