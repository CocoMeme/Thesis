import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../styles';
import { StatCard } from './StatCard';

export const StatsSection = ({ totalScans, readyGourds, pendingGourds, onStatsPress }) => {
  return (
    <View style={styles.container}>
      <StatCard
        icon="scan"
        value={totalScans || 0}
        label="Total Scans"
        color={theme.colors.primary}
        onPress={() => onStatsPress?.('total')}
      />
      <StatCard
        icon="checkmark-circle"
        value={readyGourds || 0}
        label="Ready"
        color={theme.colors.success}
        onPress={() => onStatsPress?.('ready')}
      />
      <StatCard
        icon="time"
        value={pendingGourds || 0}
        label="Pending"
        color={theme.colors.warning}
        onPress={() => onStatsPress?.('pending')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
});
