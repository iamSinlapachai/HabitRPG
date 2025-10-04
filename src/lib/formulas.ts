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
