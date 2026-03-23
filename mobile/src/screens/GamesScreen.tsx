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

const sportIcon: Record<string, string> = {
  SOCCER: '\u26BD',
  SOFTBALL: '\u{1F94E}',
  BASKETBALL: '\u{1F3C0}',
};

const statusColors: Record<string, { bg: string; text: string }> = {
  SCHEDULED: { bg: '#dbeafe', text: '#1e40af' },
  IN_PROGRESS: { bg: '#dcfce7', text: '#166534' },
  COMPLETED: { bg: '#f3f4f6', text: '#374151' },
  POSTPONED: { bg: '#fef9c3', text: '#854d0e' },
  CANCELLED: { bg: '#fee2e2', text: '#991b1b' },
};

export default function GamesScreen() {
  const [games, setGames] = useState<any[]>([]);
  const [filter, setFilter] = useState('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  async function loadGames() {
    try {
      const params = filter === 'upcoming' ? { upcoming: 'true' } : filter !== 'all' ? { status: filter } : undefined;
      const data = await api.getGames(params as any);
      setGames(data.games || []);
    } catch {}
  }

  useEffect(() => { loadGames(); }, [filter]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadGames();
    setRefreshing(false);
  }, [filter]);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        {['upcoming', 'all', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterActiveText]}>
              {f === 'upcoming' ? 'Upcoming' : f === 'all' ? 'All' : f.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[600]} />}
      >
        {games.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{'\u{1F4C5}'}</Text>
            <Text style={styles.emptyText}>No games found</Text>
          </View>
        ) : (
          games.map((game) => {
            const statusStyle = statusColors[game.status] || statusColors.SCHEDULED;
            return (
              <TouchableOpacity key={game.id} style={styles.gameCard}>
                <View style={styles.gameHeader}>
                  <Text style={styles.gameSport}>{sportIcon[game.sportType]}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                      {game.status.replace('_', ' ')}
                    </Text>
                  </View>
                </View>

                <View style={styles.matchup}>
                  <View style={styles.teamSide}>
                    <View style={[styles.miniLogo, { backgroundColor: game.homeTeam?.primaryColor || colors.primary[600] }]}>
                      <Text style={styles.miniInitial}>{game.homeTeam?.name?.charAt(0)}</Text>
                    </View>
                    <Text style={styles.teamName} numberOfLines={1}>{game.homeTeam?.name}</Text>
                    {game.homeScore !== null && (
                      <Text style={styles.score}>{game.homeScore}</Text>
                    )}
                  </View>
                  <Text style={styles.vs}>vs</Text>
                  <View style={styles.teamSide}>
                    <View style={[styles.miniLogo, { backgroundColor: game.awayTeam?.primaryColor || colors.gray[400] }]}>
                      <Text style={styles.miniInitial}>{game.awayTeam?.name?.charAt(0)}</Text>
                    </View>
                    <Text style={styles.teamName} numberOfLines={1}>{game.awayTeam?.name}</Text>
                    {game.awayScore !== null && (
                      <Text style={styles.score}>{game.awayScore}</Text>
                    )}
                  </View>
                </View>

                <Text style={styles.gameDate}>
                  {new Date(game.scheduledAt).toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric',
                    hour: 'numeric', minute: '2-digit',
                  })}
                  {game.location ? ` \u2022 ${game.location}` : ''}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  filterScroll: { maxHeight: 56, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray[200] },
  filterContainer: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm, alignItems: 'center' },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
  },
  filterActive: { backgroundColor: colors.primary[600] },
  filterText: { fontSize: fontSize.sm, color: colors.gray[600] },
  filterActiveText: { color: colors.white, fontWeight: '600' },
  list: { flex: 1, padding: spacing.md },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyIcon: { fontSize: 60, marginBottom: spacing.md },
  emptyText: { fontSize: fontSize.lg, color: colors.gray[400] },
  gameCard: {
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
  gameHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  gameSport: { fontSize: 20 },
  statusBadge: { borderRadius: borderRadius.full, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  statusText: { fontSize: fontSize.xs, fontWeight: '600' },
  matchup: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md, marginBottom: spacing.sm },
  teamSide: { flex: 1, alignItems: 'center' },
  miniLogo: { width: 36, height: 36, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  miniInitial: { color: colors.white, fontWeight: 'bold', fontSize: fontSize.sm },
  teamName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.gray[800], textAlign: 'center' },
  score: { fontSize: fontSize.xxl, fontWeight: 'bold', color: colors.gray[900], marginTop: 4 },
  vs: { fontSize: fontSize.sm, color: colors.gray[400], fontWeight: '600' },
  gameDate: { fontSize: fontSize.xs, color: colors.gray[500], textAlign: 'center' },
});
