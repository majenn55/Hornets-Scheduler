import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, fontSize, borderRadius } from '../utils/theme';
import { api } from '../services/api';

const { width: screenWidth } = Dimensions.get('window');
const imageSize = (screenWidth - spacing.md * 3) / 2;

export default function MediaScreen() {
  const [media, setMedia] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  async function loadMedia() {
    try {
      const typeParam = filter !== 'all' ? { type: filter } : undefined;
      const data = await api.getMedia(typeParam as any);
      setMedia(data.media || []);
    } catch {}
  }

  useEffect(() => { loadMedia(); }, [filter]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMedia();
    setRefreshing(false);
  }, [filter]);

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera access is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadFile(result.assets[0]);
    }
  }

  async function recordVideo() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera access is required to record videos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['videos'],
      videoMaxDuration: 300,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadFile(result.assets[0]);
    }
  }

  async function pickFromLibrary() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Library access is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 0.8,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      for (const asset of result.assets) {
        await uploadFile(asset);
      }
    }
  }

  async function uploadFile(asset: ImagePicker.ImagePickerAsset) {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        name: asset.fileName || `media_${Date.now()}.${asset.type === 'video' ? 'mp4' : 'jpg'}`,
        type: asset.type === 'video' ? 'video/mp4' : 'image/jpeg',
      } as any);

      await api.uploadMedia(formData);
      loadMedia();
    } catch {
      Alert.alert('Upload failed', 'Please try again');
    }
  }

  return (
    <View style={styles.container}>
      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
          <Text style={styles.actionIcon}>{'\u{1F4F7}'}</Text>
          <Text style={styles.actionLabel}>Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={recordVideo}>
          <Text style={styles.actionIcon}>{'\u{1F3A5}'}</Text>
          <Text style={styles.actionLabel}>Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={pickFromLibrary}>
          <Text style={styles.actionIcon}>{'\u{1F4C1}'}</Text>
          <Text style={styles.actionLabel}>Library</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {['all', 'PHOTO', 'VIDEO'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterActiveText]}>
              {f === 'all' ? 'All' : f === 'PHOTO' ? 'Photos' : 'Videos'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[600]} />}
        contentContainerStyle={styles.grid}
      >
        {media.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{'\u{1F4F8}'}</Text>
            <Text style={styles.emptyText}>No media yet</Text>
            <Text style={styles.emptyHint}>Take photos or record videos from your games!</Text>
          </View>
        ) : (
          media.map((item) => (
            <TouchableOpacity key={item.id} style={styles.mediaCard}>
              <View style={styles.mediaThumbnail}>
                {item.type === 'VIDEO' ? (
                  <Text style={styles.mediaIcon}>{'\u{25B6}\u{FE0F}'}</Text>
                ) : (
                  <Text style={styles.mediaIcon}>{'\u{1F5BC}\u{FE0F}'}</Text>
                )}
                <View style={[styles.typeBadge, item.type === 'VIDEO' ? styles.videoBadge : styles.photoBadge]}>
                  <Text style={styles.typeBadgeText}>{item.type === 'VIDEO' ? 'Video' : 'Photo'}</Text>
                </View>
              </View>
              <Text style={styles.mediaName} numberOfLines={1}>{item.fileName}</Text>
              <Text style={styles.mediaDate}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  actionIcon: { fontSize: 24 },
  actionLabel: { fontSize: fontSize.xs, color: colors.primary[600], fontWeight: '600', marginTop: 2 },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    paddingBottom: 0,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
  },
  filterActive: { backgroundColor: colors.primary[600] },
  filterText: { fontSize: fontSize.sm, color: colors.gray[600] },
  filterActiveText: { color: colors.white, fontWeight: '600' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    gap: spacing.sm,
  },
  empty: { width: '100%', alignItems: 'center', paddingVertical: spacing.xxl },
  emptyIcon: { fontSize: 60, marginBottom: spacing.md },
  emptyText: { fontSize: fontSize.lg, color: colors.gray[400] },
  emptyHint: { fontSize: fontSize.sm, color: colors.gray[300], marginTop: spacing.xs },
  mediaCard: {
    width: imageSize,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mediaThumbnail: {
    width: '100%',
    height: imageSize,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaIcon: { fontSize: 36 },
  typeBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  photoBadge: { backgroundColor: colors.primary[100] },
  videoBadge: { backgroundColor: '#dbeafe' },
  typeBadgeText: { fontSize: 10, fontWeight: '600' },
  mediaName: { fontSize: fontSize.xs, color: colors.gray[700], padding: spacing.sm, paddingBottom: 0 },
  mediaDate: { fontSize: 10, color: colors.gray[400], paddingHorizontal: spacing.sm, paddingBottom: spacing.sm },
});
