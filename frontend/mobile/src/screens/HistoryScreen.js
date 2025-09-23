import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles';

// Mock data for demonstration
const mockHistory = [
  {
    id: '1',
    gourdType: 'Butternut Squash',
    confidence: 95.2,
    date: '2024-01-15',
    time: '2:30 PM',
  },
  {
    id: '2',
    gourdType: 'Acorn Squash',
    confidence: 88.7,
    date: '2024-01-14',
    time: '10:15 AM',
  },
  {
    id: '3',
    gourdType: 'Delicata Squash',
    confidence: 92.1,
    date: '2024-01-13',
    time: '4:45 PM',
  },
];

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState(mockHistory);
  const [filter, setFilter] = useState('all'); // all, recent, favorites

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => handleViewDetails(item)}
    >
      <View style={styles.itemImage}>
        <MaterialCommunityIcons name="leaf" size={32} color="#4CAF50" style={styles.itemIcon} />
      </View>
      
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.gourdType}</Text>
        <Text style={styles.itemSubtitle}>
          Confidence: {item.confidence}%
        </Text>
        <Text style={styles.itemDate}>
          {item.date} at {item.time}
        </Text>
      </View>

      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleShare(item)}
        >
          <MaterialCommunityIcons name="share-variant" size={20} color="#6C757D" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item.id)}
        >
          <MaterialCommunityIcons name="delete-outline" size={20} color="#6C757D" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const handleViewDetails = (item) => {
    Alert.alert(
      'Scan Details',
      `Gourd: ${item.gourdType}\nConfidence: ${item.confidence}%\nScanned: ${item.date} at ${item.time}`,
      [{ text: 'OK' }]
    );
  };

  const handleShare = (item) => {
    Alert.alert('Info', 'Share functionality will be implemented next');
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Scan',
      'Are you sure you want to delete this scan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setHistory(prev => prev.filter(item => item.id !== id));
          },
        },
      ]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="cellphone" size={64} color="#9E9E9E" style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>No scan history</Text>
      <Text style={styles.emptySubtitle}>
        Your scanned gourds will appear here
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('Camera')}
      >
        <Text style={styles.emptyButtonText}>Start Scanning</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan History</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => Alert.alert('Info', 'Filter options coming soon')}
        >
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {history.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{history.length}</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {Math.round(history.reduce((acc, item) => acc + item.confidence, 0) / history.length)}%
              </Text>
              <Text style={styles.statLabel}>Avg Confidence</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {new Set(history.map(item => item.gourdType)).size}
              </Text>
              <Text style={styles.statLabel}>Types Found</Text>
            </View>
          </View>

          <FlatList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  filterButton: {
    padding: theme.spacing.sm,
  },
  filterIcon: {
    fontSize: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  itemImage: {
    width: 60,
    height: 60,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  itemIcon: {
    // Styles for MaterialCommunityIcons are handled by props
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  itemSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  itemDate: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  actionIcon: {
    fontSize: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyIcon: {
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  emptyButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  emptyButtonText: {
    color: theme.colors.surface,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
});