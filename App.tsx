import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import CurrencyPill from './src/components/CurrencyPill';
import HabitListItem from './src/components/HabitListItem';
import StatBar from './src/components/StatBar';

const level = 12;
const hp = 85;
const hpMax = 100;
const xp = 750;
const xpMax = 1000;
const gold = 2450;
const gems = 15;

const starterGoals = [
  {
    id: '1',
    title: 'Begin your journey',
    reward: 'Reward: 10 gold',
    status: 'completed' as const,
  },
  {
    id: '2',
    title: 'Create your first habit',
    reward: 'Reward: 5 gold',
    status: 'startable' as const,
  },
  {
    id: '3',
    title: 'Complete dailies for 3 days',
    reward: 'Reward: 25 XP',
    status: 'startable' as const,
  },
];

const App: React.FC = () => {
  const handleStartGoal = (title: string) => () => {
    console.log(`Start goal: ${title}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <View style={styles.headerPlaceholder} />
          <Text style={styles.headerGreeting}>Welcome, Adventurer!</Text>
          <Text style={styles.levelText}>Lvl {level}</Text>
        </View>

        <View style={styles.sectionSpacing}>
          <View style={styles.playerCard}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarInitials}>HA</Text>
            </View>
            <View style={styles.playerStats}>
              <View style={styles.statBarWrapper}>
                <StatBar label="Health" value={hp} max={hpMax} color="#22C55E" />
              </View>
              <View style={styles.statBarWrapper}>
                <StatBar label="Experience" value={xp} max={xpMax} color="#A78BFA" />
              </View>
              <View style={styles.currencyRow}>
                <View style={styles.currencyPillWrapper}>
                  <CurrencyPill label="Gold" value={gold} />
                </View>
                <CurrencyPill label="Gems" value={gems} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionSpacing}>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Starter Goals</Text>
            <View>
              {starterGoals.map(goal => (
                <View key={goal.id} style={styles.goalItemWrapper}>
                  <HabitListItem
                    title={goal.title}
                    reward={goal.reward}
                    status={goal.status}
                    onStart={goal.status === 'startable' ? handleStartGoal(goal.title) : undefined}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1F2937',
    backgroundColor: '#111827',
  },
  headerGreeting: {
    flex: 1,
    marginHorizontal: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#E5E7EB',
  },
  levelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  sectionSpacing: {
    marginBottom: 24,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#1F2937',
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  avatarInitials: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E5E7EB',
  },
  playerStats: {
    flex: 1,
  },
  statBarWrapper: {
    marginBottom: 12,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyPillWrapper: {
    marginRight: 12,
  },
  sectionCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E5E7EB',
    marginBottom: 16,
  },
  goalItemWrapper: {
    marginBottom: 12,
  },
});

export default App;
