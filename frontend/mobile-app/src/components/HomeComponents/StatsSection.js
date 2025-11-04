import React, { useRef, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { theme } from '../../styles';
import { StatCard } from './StatCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_HORIZONTAL_MARGIN = theme.spacing.sm;
const CARD_WIDTH = SCREEN_WIDTH - (theme.spacing.sm * 2) - (CARD_HORIZONTAL_MARGIN * 2);
const SNAP_WIDTH = CARD_WIDTH + (CARD_HORIZONTAL_MARGIN * 2);

export const StatsSection = ({ 
  totalScans, 
  readyGourds, 
  pendingGourds, 
  onStatsPress,
  recentScans = [] 
}) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get last 5 scans with dates
  const recentScansData = recentScans.slice(0, 5).map(scan => ({
    result: scan.result,
    date: new Date(scan.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }));

  const statsData = [
    {
      id: 'total',
      icon: 'qrcode-scan',
      value: totalScans || 0,
      label: 'Total Scans',
      color: theme.colors.info,
      gradientColors: [theme.colors.info, '#2874a6'],
      details: recentScansData,
      detailsTitle: 'Recent Scans'
    },
    {
      id: 'ready',
      icon: 'check-circle',
      value: readyGourds || 0,
      label: 'Ready for Harvest',
      color: theme.colors.primary,
      gradientColors: [theme.colors.primary, '#4a8a3f'],
      details: [],
      detailsTitle: 'Ready Gourds'
    },
    {
      id: 'pending',
      icon: 'clock-outline',
      value: pendingGourds || 0,
      label: 'Almost Ready',
      color: theme.colors.secondary,
      gradientColors: [theme.colors.secondary, '#c9c940'],
      details: [],
      detailsTitle: 'Pending Gourds'
    },
  ];

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const renderItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <StatCard
        icon={item.icon}
        value={item.value}
        label={item.label}
        color={item.color}
        gradientColors={item.gradientColors}
        onPress={() => onStatsPress?.(item.id)}
        details={item.details}
        detailsTitle={item.detailsTitle}
        isExpanded={true}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={statsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_WIDTH}
        decelerationRate="fast"
        snapToAlignment="start"
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        contentContainerStyle={styles.flatListContent}
      />
      
      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {statsData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentIndex === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -theme.spacing.sm,
    marginVertical: theme.spacing.xs - 2,
  },
  flatListContent: {
    paddingHorizontal: theme.spacing.sm,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_HORIZONTAL_MARGIN,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.border,
    opacity: 0.5,
  },
  paginationDotActive: {
    width: 16,
    backgroundColor: theme.colors.primary,
    opacity: 1,
  },
});
