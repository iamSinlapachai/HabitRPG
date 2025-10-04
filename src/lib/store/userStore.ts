import { create } from 'zustand';

export type EquipmentSlot = 'head' | 'body' | 'weapon' | 'offhand' | 'accessory';

export type EquipmentLoadout = Partial<Record<EquipmentSlot, string>>;

export interface UserSnapshot {
  level: number;
  xp: number;
  xpToNext: number;
  hp: number;
  maxHp: number;
  coins: number;
  equipment: EquipmentLoadout;
}

interface UserActions {
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  equip: (slot: EquipmentSlot, itemId: string) => void;
  unequip: (slot: EquipmentSlot) => void;
  hydrate: (snapshot: UserSnapshot) => void;
  reset: () => void;
}

export type UserState = UserSnapshot & UserActions;

const calculateXpToNext = (level: number) => Math.round(100 * Math.pow(1.15, level - 1));

const initialSnapshot: UserSnapshot = {
  level: 1,
  xp: 0,
  xpToNext: calculateXpToNext(1),
  hp: 50,
  maxHp: 50,
  coins: 0,
  equipment: {},
};

export const useUserStore = create<UserState>((set, get) => ({
  ...initialSnapshot,
  addXp: (amount: number) => {
    if (amount <= 0) {
      return;
    }

    set((state) => {
      let { xp, level } = state;
      let xpToNext = state.xpToNext;
      let remainingXp = xp + amount;

      while (remainingXp >= xpToNext) {
        remainingXp -= xpToNext;
        level += 1;
        xpToNext = calculateXpToNext(level);
      }

      return {
        xp: remainingXp,
        level,
        xpToNext,
      };
    });
  },
  addCoins: (amount: number) => {
    if (amount === 0) {
      return;
    }

    set((state) => ({
      coins: Math.max(0, state.coins + amount),
    }));
  },
  spendCoins: (amount: number) => {
    if (amount <= 0) {
      return true;
    }

    const { coins } = get();
    if (coins < amount) {
      return false;
    }

    set({ coins: coins - amount });
    return true;
  },
  takeDamage: (amount: number) => {
    if (amount <= 0) {
      return;
    }

    set((state) => ({
      hp: Math.max(0, state.hp - amount),
    }));
  },
  heal: (amount: number) => {
    if (amount <= 0) {
      return;
    }

    set((state) => ({
      hp: Math.min(state.maxHp, state.hp + amount),
    }));
  },
  equip: (slot: EquipmentSlot, itemId: string) => {
    set((state) => ({
      equipment: {
        ...state.equipment,
        [slot]: itemId,
      },
    }));
  },
  unequip: (slot: EquipmentSlot) => {
    set((state) => {
      if (!(slot in state.equipment)) {
        return {} as Partial<UserState>;
      }

      const updated = { ...state.equipment };
      delete updated[slot];

      return {
        equipment: updated,
      };
    });
  },
  hydrate: (snapshot: UserSnapshot) => {
    set({
      ...snapshot,
      xpToNext: snapshot.xpToNext ?? calculateXpToNext(snapshot.level),
      equipment: { ...snapshot.equipment },
    });
  },
  reset: () => {
    set({ ...initialSnapshot });
  },
}));

export const getUserSnapshot = (state: UserState): UserSnapshot => ({
  level: state.level,
  xp: state.xp,
  xpToNext: state.xpToNext,
  hp: state.hp,
  maxHp: state.maxHp,
  coins: state.coins,
  equipment: { ...state.equipment },
});

export const userInitialSnapshot = initialSnapshot;
