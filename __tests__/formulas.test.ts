import {
  TASK_VALUE_CEILING,
  TASK_VALUE_FLOOR,
  clampTaskValue,
  getCriticalChance,
  getCriticalMultiplier,
  taskValueToBossDamage,
  taskValueToDropRate,
  taskValueToExperience,
  taskValueToGold,
  taskValueToTavernDamage,
} from '../src/lib/formulas';

describe('clampTaskValue', () => {
  it('clamps values below the floor to the minimum supported task value', () => {
    const clamped = clampTaskValue(TASK_VALUE_FLOOR - 100);

    expect(clamped).toBe(TASK_VALUE_FLOOR);
  });

  it('clamps values above the ceiling to the maximum supported task value', () => {
    const clamped = clampTaskValue(TASK_VALUE_CEILING + 100);

    expect(clamped).toBe(TASK_VALUE_CEILING);
  });

  it('normalises non-finite input to zero', () => {
    expect(clampTaskValue(Number.NaN)).toBe(0);
    expect(clampTaskValue(Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe('critical calculations', () => {
  it('keeps the base critical chance for non-positive strength values', () => {
    expect(getCriticalChance(-50)).toBe(0.05);
  });

  it('scales the critical chance with strength until hitting the cap', () => {
    expect(getCriticalChance(100)).toBeCloseTo(0.3, 3);
    expect(getCriticalChance(500)).toBe(0.75);
  });

  it('returns a predictable multiplier with strength bonuses', () => {
    expect(getCriticalMultiplier(0)).toBe(1.5);
    expect(getCriticalMultiplier(80)).toBe(1.9);
  });
});

describe('taskValueToTavernDamage', () => {
  it('applies a minimum damage when the task value is neutral or positive', () => {
    expect(taskValueToTavernDamage(0)).toBe(0.1);
    expect(taskValueToTavernDamage(5)).toBe(0.1);
  });

  it('returns scaled damage when the task value is negative', () => {
    expect(taskValueToTavernDamage(-4)).toBe(1);
    expect(taskValueToTavernDamage(-100)).toBeCloseTo(11.82, 2);
  });
});

describe('taskValueToBossDamage', () => {
  it('never awards negative boss damage', () => {
    expect(taskValueToBossDamage(-5, 10)).toBe(0);
    expect(taskValueToBossDamage(5, 10, 5000)).toBe(0);
  });

  it('scales with strength and defence mitigation', () => {
    expect(taskValueToBossDamage(10, 50)).toBeCloseTo(12.5, 2);
    expect(taskValueToBossDamage(10, 50, 100)).toBeCloseTo(11.5, 2);
  });
});

describe('taskValueToExperience', () => {
  it('returns zero for non-positive task values', () => {
    expect(taskValueToExperience(-10, 25)).toBe(0);
  });

  it('scales critical rewards with strength rather than intelligence', () => {
    const base = taskValueToExperience(5, 200);
    const critWithStrength = taskValueToExperience(5, 200, {
      isCritical: true,
      strength: 100,
    });
    const expectedMultiplier = getCriticalMultiplier(100);

    expect(critWithStrength).toBeCloseTo(base * expectedMultiplier, 2);
  });

  it('does not increase the critical multiplier when only intelligence is high', () => {
    const highIntBase = taskValueToExperience(5, 200);
    const highIntCrit = taskValueToExperience(5, 200, { isCritical: true, strength: 0 });
    const lowIntBase = taskValueToExperience(5, 0);
    const lowIntCrit = taskValueToExperience(5, 0, { isCritical: true, strength: 0 });

    const highIntMultiplier = highIntCrit / highIntBase;
    const lowIntMultiplier = lowIntCrit / lowIntBase;

    expect(highIntMultiplier).toBeCloseTo(lowIntMultiplier, 5);
  });

  it('calculates experience rewards with attribute and critical modifiers', () => {
    expect(taskValueToExperience(10, 50)).toBeCloseTo(9, 2);
    expect(taskValueToExperience(10, 50, { isCritical: true, strength: 50 })).toBeCloseTo(
      15.75,
      2,
    );
  });
});

describe('taskValueToGold', () => {
  it('returns zero gold for depleted task values', () => {
    expect(taskValueToGold(0, 40)).toBe(0);
  });

  it('applies the critical multiplier based on strength', () => {
    const base = taskValueToGold(5, 20);
    const crit = taskValueToGold(5, 20, { isCritical: true, strength: 80 });

    expect(crit).toBeCloseTo(base * getCriticalMultiplier(80), 2);
  });

  it('calculates gold rewards with perception bonuses and critical hits', () => {
    expect(taskValueToGold(10, 40)).toBeCloseTo(5.6, 2);
    expect(taskValueToGold(10, 40, { isCritical: true, strength: 40 })).toBeCloseTo(9.52, 2);
  });
});

describe('taskValueToDropRate', () => {
  it('starts with the base drop chance when perception and task value are zero', () => {
    expect(taskValueToDropRate(0, 0)).toBe(0.3);
  });

  it('increases drop chance with task value and perception until capped', () => {
    expect(taskValueToDropRate(5, 10)).toBeCloseTo(0.433, 3);
    expect(taskValueToDropRate(100, 500)).toBe(0.9);
  });
});
