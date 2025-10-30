import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../styles';
import { StatCard } from './StatCard';

export const StatsSection = ({ totalScans, readyGourds, pendingGourds, onStatsPress }) => {
  return (
    <View style={styles.container}>
      <StatCard
        icon="qrcode-scan"
        value={totalScans || 0}
        label="Total Scans"
        color={theme.colors.info}
        gradientColors={[theme.colors.info, '#2874a6']}
        onPress={() => onStatsPress?.('total')}
      />
      <StatCard
        icon="check-circle"
        value={readyGourds || 0}
        label="Ready"
        color={theme.colors.primary}
        gradientColors={[theme.colors.primary, '#4a8a3f']}
        onPress={() => onStatsPress?.('ready')}
      />
      <StatCard
        icon="clock-outline"
        value={pendingGourds || 0}
        label="Pending"
        color={theme.colors.secondary}
        gradientColors={[theme.colors.secondary, '#c9c940']}
        onPress={() => onStatsPress?.('pending')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
});
