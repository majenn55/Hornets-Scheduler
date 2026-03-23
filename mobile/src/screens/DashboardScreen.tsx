import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../utils/theme';
import { api } from '../services/api';

export default function DashboardScreen({ navigation }: any) {
  const [teams, setTeams] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    try {
      const [teamsData, gamesData, notifData] = await Promise.all([
        api.getTeams(),
        api.getGames({ upcoming: 'true' }),
        api.getNotifications(true),
      ]);
      setTeams(teamsData.teams || []);
      setGames(gamesData.games || []);
      setNotifications(notifData.notifications || []);
    } catch {}
  }

  useEffect(() => { loadData(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const sportIcon: Record<string, string> = {
    SOCCER: '\u26BD',
    SOFTBALL: '\u{1F94E}',
    BASKETBALL: '\u{1F3C0}',
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[600]} />}
    >
      {/* Hero Banner */}
      <View style={styles.hero}>
        <Text style={styles.heroIcon}>{'\u{1F41D}'}</Text>
        <Text style={styles.heroTitle}>Go Hornets!</Text>
        <Text style={styles.heroSubtitle}>Greenhill School Athletics</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <StatCard icon={'\u{1F3C6}'} label="Teams" value={teams.length} />
        <StatCard icon={'\u{1F4C5}'} label="Upcoming" value={games.length} />
        <StatCard icon={'\u{1F514}'} label="Alerts" value={notifications.length} />
      </View>

      {/* Upcoming Games */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Games</Text>
        {games.length === 0 ? (
          <Text style={styles.emptyText}>No upcoming games scheduled.</Text>
        ) : (
          games.slice(0, 5).map((game: any) => (
            <TouchableOpacity key={game.id} style={styles.gameCard}>
              <Text style={styles.sportIcon}>{sportIcon[game.sportType] || '\u{26BD}'}</Text>
              <View style={styles.gameInfo}>
                <Text style={styles.gameTeams}>
                  {game.homeTeam?.name} vs {game.awayTeam?.name}
                </Text>
                <Text style={styles.gameDate}>
                  {new Date(game.scheduledAt).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{game.status}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* My Teams */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Teams</Text>
        {teams.length === 0 ? (
          <Text style={styles.emptyText}>No teams yet. Create one to get started!</Text>
        ) : (
          <View style={styles.teamsGrid}>
            {teams.map((team: any) => (
              <TouchableOpacity key={team.id} style={styles.teamCard}>
                <View style={[styles.teamLogo, { backgroundColor: team.primaryColor || colors.primary[600] }]}>
                  <Text style={styles.teamInitial}>{team.name.charAt(0)}</Text>
                </View>
                <Text style={styles.teamName} numberOfLines={1}>{team.name}</Text>
                <Text style={styles.teamSport}>
                  {sportIcon[team.sportType]} {team.sportType.toLowerCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <View style={styles.statCard}>
      <Text style={{ fontSize: 24 }}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  hero: {
    backgroundColor: colors.primary[600],
    padding: spacing.xl,
    alignItems: 'center',
    paddingBottom: spacing.xxl,
  },
  heroIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.white,
  },
  heroSubtitle: {
    fontSize: fontSize.sm,
    color: colors.accent[400],
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginTop: -spacing.xl,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.primary[600],
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
  },
  section: {
    padding: spacing.md,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.gray[800],
    marginBottom: spacing.md,
  },
  emptyText: {
    color: colors.gray[400],
    fontSize: fontSize.sm,
    textAlign: 'center',
    padding: spacing.xl,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sportIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  gameInfo: {
    flex: 1,
  },
  gameTeams: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[800],
  },
  gameDate: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  statusText: {
    fontSize: fontSize.xs,
    color: colors.primary[600],
    fontWeight: '600',
  },
  teamsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  teamCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    width: '30%',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  teamLogo: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  teamInitial: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: 'bold',
  },
  teamName: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
    textAlign: 'center',
  },
  teamSport: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
    marginTop: 2,
  },
});
