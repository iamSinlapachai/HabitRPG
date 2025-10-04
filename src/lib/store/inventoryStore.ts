import { create } from 'zustand';

import { useUserStore, type EquipmentSlot } from './userStore';

export type ConsumableEffectType = 'heal' | 'xp' | 'coins';

export interface ConsumableEffect {
  type: ConsumableEffectType;
  amount: number;
}

export interface BaseItem {
  id: string;
  name: string;
  description?: string;
}

export interface ConsumableItem extends BaseItem {
  type: 'consumable';
  effect: ConsumableEffect;
}

export interface EquipmentItem extends BaseItem {
  type: 'equipment';
  slot: EquipmentSlot;
}

export type InventoryItem = ConsumableItem | EquipmentItem;

export interface InventoryEntry {
  item: InventoryItem;
  quantity: number;
}

export type InventoryCollection = Record<string, InventoryEntry>;

export interface InventorySnapshot {
  items: InventoryCollection;
}

interface InventoryActions {
  addItem: (item: InventoryItem, quantity?: number) => void;
  removeItem: (itemId: string, quantity?: number) => void;
  useItem: (itemId: string) => boolean;
  equipItem: (itemId: string) => boolean;
  unequip: (slot: EquipmentSlot) => void;
  hydrate: (snapshot: InventorySnapshot) => void;
  reset: () => void;
}

export type InventoryState = InventorySnapshot & InventoryActions;

const initialSnapshot: InventorySnapshot = {
  items: {},
};

const applyConsumableEffect = (effect: ConsumableEffect) => {
  const user = useUserStore.getState();

  switch (effect.type) {
    case 'heal':
      user.heal(effect.amount);
      break;
    case 'xp':
      user.addXp(effect.amount);
      break;
    case 'coins':
      user.addCoins(effect.amount);
      break;
    default: {
      const exhaustiveCheck: never = effect.type;
      throw new Error(`Unhandled consumable effect: ${exhaustiveCheck}`);
    }
  }
};

export const useInventoryStore = create<InventoryState>((set, get) => ({
  ...initialSnapshot,
  addItem: (item, quantity = 1) => {
    if (quantity <= 0) {
      return;
    }

    set((state) => {
      const existing = state.items[item.id];
      const nextQuantity = (existing?.quantity ?? 0) + quantity;

      return {
        items: {
          ...state.items,
          [item.id]: {
            item: existing?.item ?? item,
            quantity: nextQuantity,
          },
        },
      };
    });
  },
  removeItem: (itemId, quantity = 1) => {
    if (quantity <= 0) {
      return;
    }

    set((state) => {
      const existing = state.items[itemId];
      if (!existing) {
        return {} as Partial<InventoryState>;
      }

      const remaining = existing.quantity - quantity;
      const updated = { ...state.items };

      if (remaining > 0) {
        updated[itemId] = {
          ...existing,
          quantity: remaining,
        };
      } else {
        delete updated[itemId];
      }

      return { items: updated };
    });
  },
  useItem: (itemId) => {
    const entry = get().items[itemId];
    if (!entry) {
      return false;
    }

    if (entry.item.type === 'consumable') {
      applyConsumableEffect(entry.item.effect);
      set((state) => {
        const updated = { ...state.items };
        const remaining = entry.quantity - 1;

        if (remaining > 0) {
          updated[itemId] = {
            ...entry,
            quantity: remaining,
          };
        } else {
          delete updated[itemId];
        }

        return { items: updated };
      });
      return true;
    }

    if (entry.item.type === 'equipment') {
      useUserStore.getState().equip(entry.item.slot, entry.item.id);
      return true;
    }

    return false;
  },
  equipItem: (itemId) => {
    const entry = get().items[itemId];
    if (!entry || entry.item.type !== 'equipment') {
      return false;
    }

    useUserStore.getState().equip(entry.item.slot, entry.item.id);
    return true;
  },
  unequip: (slot) => {
    useUserStore.getState().unequip(slot);
  },
  hydrate: (snapshot) => {
    set({
      items: Object.fromEntries(
        Object.entries(snapshot.items).map(([id, value]) => [
          id,
          {
            item: value.item,
            quantity: value.quantity,
          },
        ]),
      ),
    });
  },
  reset: () => {
    set({ ...initialSnapshot });
  },
}));

export const getInventorySnapshot = (state: InventoryState): InventorySnapshot => ({
  items: Object.fromEntries(
    Object.entries(state.items).map(([id, entry]) => [
      id,
      {
        item: entry.item,
        quantity: entry.quantity,
      },
    ]),
  ),
});

export const inventoryInitialSnapshot = initialSnapshot;
