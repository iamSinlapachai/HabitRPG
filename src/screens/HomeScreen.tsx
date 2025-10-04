import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import CurrencyPill from '../components/CurrencyPill';
import HabitListItem from '../components/HabitListItem';
import StatBar from '../components/StatBar';
import { colors } from '../theme/colors';

const level = 12;
const hp = 85;
const hpMax = 100;
const xp = 750;
const xpMax = 1000;
const gold = 2450;
const gems = 15;

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.menuPlaceholder} />
              <Text style={styles.welcomeText}>Welcome, Adventurer!</Text>
            </View>
            <Text style={styles.levelText}>Lvl {level}</Text>
          </View>

          <View style={styles.playerCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitials}>AV</Text>
              </View>
            </View>
            <View style={styles.statsSection}>
              <StatBar label="Health" value={hp} max={hpMax} color={colors.green} />
              <View style={styles.barSpacing} />
              <StatBar label="Experience" value={xp} max={xpMax} color={colors.purple} />
              <View style={styles.currencyRow}>
                <View style={styles.currencyItem}>
                  <CurrencyPill label="Gold" value={gold} />
                </View>
                <View style={[styles.currencyItem, styles.currencyItemLast]}>
                  <CurrencyPill label="Gems" value={gems} />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Starter Goals</Text>
            <View>
              <HabitListItem
                title="Begin your journey"
                reward="Reward: 10 gold"
                status="completed"
              />
              <HabitListItem
                title="Create your first habit"
                reward="Reward: 5 gold"
                status="startable"
                onStart={() => console.log('Create your first habit')}
              />
              <HabitListItem
                title="Complete dailies for 3 days"
                reward="Reward: 25 XP"
                status="startable"
                onStart={() => console.log('Complete dailies for 3 days')}
              />
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
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.border,
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.purple,
  },
  playerCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 28,
  },
  avatarContainer: {
    marginRight: 16,
    justifyContent: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.border,
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  statsSection: {
    flex: 1,
    justifyContent: 'center',
  },
  barSpacing: {
    height: 12,
  },
  currencyRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  currencyItem: {
    marginRight: 12,
  },
  currencyItemLast: {
    marginRight: 0,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
});

export default HomeScreen;
