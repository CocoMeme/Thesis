import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, RefreshControl, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../styles';
import { NewsCard, NewsModal } from '../../components';
import { getAllNews, markNewsAsRead } from '../../services/newsService';

export const NewsScreen = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadNews = useCallback(async () => {
    try {
      const response = await getAllNews({ limit: 20 });
      if (response?.success && Array.isArray(response.data)) {
        setNewsItems(response.data);
      }
    } catch (error) {
      console.error('Error fetching news feed:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadNews();
  };

  const handleNewsPress = (item) => {
    setSelectedNews(item);
  };

  const handleNewsModalClose = () => {
    setSelectedNews(null);
  };

  const handleMarkAsRead = async (newsId) => {
    try {
      await markNewsAsRead(newsId);
      setNewsItems((prev) =>
        prev.map((item) =>
          item._id === newsId
            ? { ...item, isNew: false, engagement: { ...item.engagement, views: (item.engagement?.views || 0) + 1 } }
            : item
        )
      );
    } catch (error) {
      console.error('Error marking news as read:', error);
    }
  };

  const renderItem = ({ item }) => (
    <NewsCard news={item} onPress={() => handleNewsPress(item)} />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading updates…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={newsItems}
        keyExtractor={(item, index) => item._id || String(index)}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          newsItems.length === 0 && styles.emptyListContent,
        ]}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>News & Updates</Text>
            <Text style={styles.headerSubtitle}>
              Stay in the loop with product improvements and announcements.
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No news yet</Text>
            <Text style={styles.emptyMessage}>
              Check back later for product announcements and feature updates.
            </Text>
          </View>
        )}
      />

      <NewsModal
        visible={!!selectedNews}
        news={selectedNews}
        onClose={handleNewsModalClose}
        onMarkAsRead={handleMarkAsRead}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.md,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.secondary,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    paddingVertical: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.large,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  emptyMessage: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
