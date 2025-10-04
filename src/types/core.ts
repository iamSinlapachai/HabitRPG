/**
 * Core HabitRPG domain types used across calculations and UI helpers.
 *
 * Every type in this module is intentionally exhaustive so downstream
 * consumers can rely on a consistent shape without consulting the API
 * layer.  All definitions are side-effect free and purely declarative.
 */

/**
 * The set of task categories supported by the game.
 */
export type TaskType = 'habit' | 'daily' | 'todo' | 'reward';

/**
 * Allowed priority multipliers for tasks.
 */
export type TaskPriority = 0.1 | 1 | 1.5 | 2;

/**
 * Player attributes a task may target for buff calculations.
 */
export type TaskAttribute = 'str' | 'int' | 'con' | 'per';

/**
 * Individual checklist entry attached to a task.
 */
export interface ChecklistItem {
  /** Stable identifier for the checklist entry. */
  id: string;
  /** Checklist description rendered to the user. */
  text: string;
  /** Whether the item has been completed. */
  completed: boolean;
}

/**
 * Player facing task definition.
 */
export interface Task {
  /** Unique identifier of the task. */
  id: string;
  /** Human readable title. */
  text: string;
  /** Optional Markdown notes. */
  notes?: string;
  /** Task category. */
  type: TaskType;
  /** Difficulty weight selected by the player. */
  priority: TaskPriority;
  /** Dynamic scoring value influenced by completions. */
  value: number;
  /** Attribute associated with the task. */
  attribute: TaskAttribute;
  /** Whether the task is currently due (dailies) or available. */
  isDue?: boolean;
  /** Current streak count used for daily/task decay. */
  streak?: number;
  /** Nested checklist items. */
  checklist?: ChecklistItem[];
  /** Optional tag identifiers applied by the user. */
  tags?: string[];
}

/**
 * Core stat block shared by users and monsters.
 */
export interface StatBlock {
  /** Strength attribute. */
  str: number;
  /** Intelligence attribute. */
  int: number;
  /** Constitution attribute. */
  con: number;
  /** Perception attribute. */
  per: number;
}

/**
 * Summary of the player's current statistics.
 */
export interface UserStats extends StatBlock {
  /** Player level. */
  lvl: number;
  /** Current experience points. */
  exp: number;
  /** Current health points. */
  hp: number;
  /** Maximum health points. */
  maxHealth: number;
  /** Current mana points. */
  mp: number;
  /** Maximum mana points. */
  maxMana: number;
  /** Gold currency owned by the player. */
  gp: number;
}

/**
 * Equipment loadout used when calculating buffs.
 */
export interface EquipmentSet {
  /** Weapon currently equipped. */
  weapon?: Item;
  /** Armor currently equipped. */
  armor?: Item;
  /** Head gear currently equipped. */
  head?: Item;
  /** Off-hand item currently equipped. */
  shield?: Item;
  /** Additional costume items by slot. */
  costume?: Partial<Record<'weapon' | 'armor' | 'head' | 'shield', Item>>;
}

/**
 * Representation of a player's inventory.
 */
export interface Inventory {
  /** Owned equipment grouped by slot. */
  equipment?: EquipmentSet;
  /** Count of owned materials keyed by item key. */
  materials?: Record<string, number>;
  /** Owned pets keyed by identifier. */
  pets?: Record<string, boolean>;
  /** Owned mounts keyed by identifier. */
  mounts?: Record<string, boolean>;
}

/**
 * Player profile stored locally.
 */
export interface User {
  /** Unique identifier. */
  id: string;
  /** Display name shown to other users. */
  name: string;
  /** Current statistic snapshot. */
  stats: UserStats;
  /** Inventory collection and equipment. */
  items: Inventory;
  /** Tasks owned by the player. */
  tasks: Task[];
  /** Earned achievements keyed by identifier. */
  achievements?: Record<string, Achievement>;
  /** Active quest participation. */
  quest?: Quest;
}

/**
 * Game item metadata.
 */
export interface Item {
  /** Machine readable key. */
  key: string;
  /** Item name. */
  text: string;
  /** Optional lore description. */
  notes?: string;
  /** Purchase price in gold. */
  value: number;
  /** Level requirement for equipping. */
  levelRequired?: number;
  /** Primary item category. */
  type: 'weapon' | 'armor' | 'head' | 'shield' | 'pet' | 'mount' | 'quest' | 'consumable';
  /** Stat bonuses granted when equipped. */
  bonuses?: Partial<StatBlock> & { hp?: number; mp?: number };
}

/**
 * Monster definition used in quest battles.
 */
export interface Monster {
  /** Unique quest identifier. */
  key: string;
  /** Display name. */
  name: string;
  /** Current health. */
  hp: number;
  /** Maximum health. */
  maxHealth: number;
  /** Offensive power influencing damage output. */
  strength: number;
  /** Defensive rating reducing player damage. */
  defense: number;
}

/**
 * Rewards granted upon quest completion.
 */
export interface QuestRewards {
  /** Experience points earned. */
  exp: number;
  /** Gold earned. */
  gp: number;
  /** Item rewards granted. */
  items?: Item[];
}

/**
 * Quest data including optional boss fights and drops.
 */
export interface Quest {
  /** Quest identifier. */
  key: string;
  /** Quest title. */
  title: string;
  /** Narrative description. */
  description: string;
  /** Boss associated with the quest, if any. */
  boss?: Monster;
  /** Collectable items required for completion. */
  collect?: Record<string, number>;
  /** Rewards distributed on success. */
  rewards: QuestRewards;
}

/**
 * Achievement progress tracker.
 */
export interface Achievement {
  /** Machine readable identifier. */
  key: string;
  /** Title displayed to the player. */
  title: string;
  /** Description or unlock text. */
  text: string;
  /** Whether the achievement has been earned. */
  earned: boolean;
  /** Optional timestamp for when the achievement was unlocked. */
  earnedOn?: string;
}

export type { Task as HabitTask, User as HabitUser, Item as HabitItem, Monster as HabitMonster, Quest as HabitQuest, Achievement as HabitAchievement };
