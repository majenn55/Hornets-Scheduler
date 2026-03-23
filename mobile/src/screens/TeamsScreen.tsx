import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../utils/theme';
import { api } from '../services/api';

const sportIcon: Record<string, string> = {
  SOCCER: '\u26BD',
  SOFTBALL: '\u{1F94E}',
  BASKETBALL: '\u{1F3C0}',
};

export default function TeamsScreen() {
  const [teams, setTeams] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', sportType: 'SOCCER', location: '' });

  async function loadTeams() {
    try {
      const data = await api.getTeams();
      setTeams(data.teams || []);
    } catch {}
  }

  useEffect(() => { loadTeams(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTeams();
    setRefreshing(false);
  }, []);

  async function createTeam() {
    if (!form.name) {
      Alert.alert('Error', 'Team name is required');
      return;
    }
    try {
      await api.createTeam(form);
      setShowCreate(false);
      setForm({ name: '', sportType: 'SOCCER', location: '' });
      loadTeams();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[600]} />}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Teams</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowCreate(true)}>
            <Text style={styles.addButtonText}>+ New Team</Text>
          </TouchableOpacity>
        </View>

        {teams.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{'\u{1F3C6}'}</Text>
            <Text style={styles.emptyText}>No teams yet</Text>
            <TouchableOpacity style={styles.createButton} onPress={() => setShowCreate(true)}>
              <Text style={styles.createButtonText}>Create Your First Team</Text>
            </TouchableOpacity>
          </View>
        ) : (
          teams.map((team) => (
            <TouchableOpacity key={team.id} style={styles.teamCard}>
              <View style={[styles.teamLogo, { backgroundColor: team.primaryColor || colors.primary[600] }]}>
                <Text style={styles.teamInitial}>{team.name.charAt(0)}</Text>
              </View>
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{team.name}</Text>
                <Text style={styles.teamMeta}>
                  {sportIcon[team.sportType]} {team.sportType.toLowerCase()} &bull; {team._count?.members || 0} members &bull; {team._count?.rosters || 0} rosters
                </Text>
                {team.league && (
                  <Text style={styles.teamLeague}>League: {team.league.name}</Text>
                )}
              </View>
              <Text style={styles.arrow}>{'\u203A'}</Text>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      {/* Create Team Modal */}
      <Modal visible={showCreate} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Create New Team</Text>
            <TextInput
              style={styles.input}
              placeholder="Team Name"
              placeholderTextColor={colors.gray[400]}
              value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })}
            />
            <View style={styles.sportPicker}>
              {(['SOCCER', 'SOFTBALL', 'BASKETBALL'] as const).map((sport) => (
                <TouchableOpacity
                  key={sport}
                  style={[styles.sportOption, form.sportType === sport && styles.sportSelected]}
                  onPress={() => setForm({ ...form, sportType: sport })}
                >
                  <Text style={styles.sportOptionIcon}>{sportIcon[sport]}</Text>
                  <Text style={[styles.sportOptionText, form.sportType === sport && styles.sportSelectedText]}>
                    {sport.charAt(0) + sport.slice(1).toLowerCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Location (optional)"
              placeholderTextColor={colors.gray[400]}
              value={form.location}
              onChangeText={(v) => setForm({ ...form, location: v })}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowCreate(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={createTeam}>
                <Text style={styles.submitText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  headerTitle: { fontSize: fontSize.xl, fontWeight: 'bold', color: colors.gray[800] },
  addButton: {
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  addButtonText: { color: colors.white, fontSize: fontSize.sm, fontWeight: '600' },
  empty: { alignItems: 'center', padding: spacing.xxl },
  emptyIcon: { fontSize: 60, marginBottom: spacing.md },
  emptyText: { fontSize: fontSize.lg, color: colors.gray[400], marginBottom: spacing.md },
  createButton: {
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  createButtonText: { color: colors.white, fontWeight: '600' },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
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
  },
  teamInitial: { color: colors.white, fontSize: fontSize.xl, fontWeight: 'bold' },
  teamInfo: { flex: 1, marginLeft: spacing.md },
  teamName: { fontSize: fontSize.md, fontWeight: '600', color: colors.gray[800] },
  teamMeta: { fontSize: fontSize.xs, color: colors.gray[500], marginTop: 2 },
  teamLeague: { fontSize: fontSize.xs, color: colors.gray[400], marginTop: 2 },
  arrow: { fontSize: 24, color: colors.gray[300] },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  modalTitle: { fontSize: fontSize.xl, fontWeight: 'bold', marginBottom: spacing.lg, color: colors.gray[800] },
  input: {
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSize.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  sportPicker: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  sportOption: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: colors.gray[50],
  },
  sportSelected: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  sportOptionIcon: { fontSize: 24, marginBottom: spacing.xs },
  sportOptionText: { fontSize: fontSize.xs, color: colors.gray[500] },
  sportSelectedText: { color: colors.primary[600], fontWeight: '600' },
  modalButtons: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  cancelText: { color: colors.gray[600], fontWeight: '600' },
  submitButton: {
    flex: 1,
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  submitText: { color: colors.white, fontWeight: '600' },
});
