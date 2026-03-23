import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../utils/theme';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [families, setFamilies] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [familyData, inviteData] = await Promise.all([
        api.getFamilies(),
        api.getInvites(),
      ]);
      setFamilies(familyData.families || []);
      setInvites(inviteData.invites || []);
    } catch {}
  }

  function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  }

  async function acceptInvite(inviteId: string) {
    try {
      await api.acceptInvite(inviteId);
      Alert.alert('Success', 'Invitation accepted!');
      loadData();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  }

  const pendingInvites = invites.filter((i: any) => i.status === 'PENDING');

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </Text>
        </View>
        <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Invites</Text>
          {pendingInvites.map((invite: any) => (
            <View key={invite.id} style={styles.inviteCard}>
              <View style={styles.inviteInfo}>
                <Text style={styles.inviteName}>
                  {invite.league?.name || invite.team?.name}
                </Text>
                <Text style={styles.inviteMeta}>
                  {invite.type} invite from {invite.sender?.firstName} {invite.sender?.lastName}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => acceptInvite(invite.id)}
              >
                <Text style={styles.acceptText}>Accept</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Family Accounts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Family Accounts</Text>
        {families.length === 0 ? (
          <Text style={styles.emptyText}>No family accounts. Create one from the web app!</Text>
        ) : (
          families.map((family: any) => (
            <View key={family.id} style={styles.familyCard}>
              <Text style={styles.familyName}>{family.name}</Text>
              <View style={styles.memberList}>
                {family.members?.map((m: any) => (
                  <View key={m.id} style={styles.memberBadge}>
                    <Text style={styles.memberText}>
                      {m.user.firstName} {m.user.lastName}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </View>

      {/* Menu Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <MenuItem icon={'\u{1F514}'} label="Notifications" />
        <MenuItem icon={'\u{1F512}'} label="Security" />
        <MenuItem icon={'\u{2139}\u{FE0F}'} label="About" />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Greenhill Hornets Scheduler v1.0.0</Text>
      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
}

function MenuItem({ icon, label }: { icon: string; label: string }) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuLabel}>{label}</Text>
      <Text style={styles.menuArrow}>{'\u203A'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  profileHeader: {
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: { color: colors.white, fontSize: fontSize.xxl, fontWeight: 'bold' },
  name: { color: colors.white, fontSize: fontSize.xl, fontWeight: 'bold' },
  email: { color: colors.white, opacity: 0.7, fontSize: fontSize.sm, marginTop: 4 },
  section: { padding: spacing.md },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: 'bold', color: colors.gray[800], marginBottom: spacing.md },
  emptyText: { color: colors.gray[400], fontSize: fontSize.sm },
  inviteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  inviteInfo: { flex: 1 },
  inviteName: { fontSize: fontSize.md, fontWeight: '600', color: colors.gray[800] },
  inviteMeta: { fontSize: fontSize.xs, color: colors.gray[500], marginTop: 2 },
  acceptButton: {
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  acceptText: { color: colors.white, fontWeight: '600', fontSize: fontSize.sm },
  familyCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  familyName: { fontSize: fontSize.md, fontWeight: '600', color: colors.gray[800], marginBottom: spacing.sm },
  memberList: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  memberBadge: {
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  memberText: { fontSize: fontSize.xs, color: colors.primary[700] },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  menuIcon: { fontSize: 20, marginRight: spacing.md },
  menuLabel: { flex: 1, fontSize: fontSize.md, color: colors.gray[800] },
  menuArrow: { fontSize: 24, color: colors.gray[300] },
  logoutButton: {
    marginHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutText: { color: colors.error, fontWeight: '600', fontSize: fontSize.md },
  footer: {
    textAlign: 'center',
    color: colors.gray[300],
    fontSize: fontSize.xs,
    marginTop: spacing.lg,
  },
});
