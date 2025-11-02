import React, {useCallback, useMemo} from 'react';
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

const MemoryOptimizedFlatList = ({
  data = [],
  renderItem,
  keyExtractor,
  onEndReached,
  onRefresh,
  refreshing = false,
  loading = false,
  hasMore = false,
  maxItems = 1000, // Increased limit for pagination support
  itemHeight = 200, // Approximate item height for getItemLayout
  ...props
}) => {
  // Memoize processed data to prevent unnecessary re-renders
  const processedData = useMemo(() => {
    // Only truncate if we have a very large dataset (for memory management)
    if (Array.isArray(data) && data.length > maxItems) {
      console.warn(
        `Data truncated from ${data.length} to ${maxItems} items for memory optimization`,
      );
      return data.slice(0, maxItems);
    }
    return data;
  }, [data, maxItems]);

  // Memoize key extractor to prevent re-creation
  const memoizedKeyExtractor = useCallback(
    (item, index) => {
      if (keyExtractor) {
        return keyExtractor(item, index);
      }
      return item?.id?.toString() || index.toString();
    },
    [keyExtractor],
  );

  // Memoize render item to prevent re-creation
  const memoizedRenderItem = useCallback(
    ({item, index}) => {
      try {
        return renderItem({item, index});
      } catch (error) {
        // console.error('Error rendering item:', error);
        return (
          <View style={styles.errorItem}>
            <Text style={styles.errorText}>Error loading item</Text>
          </View>
        );
      }
    },
    [renderItem],
  );

  // Memoize getItemLayout for better performance
  const getItemLayout = useCallback(
    (data, index) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [itemHeight],
  );

  // Memoize onEndReached to prevent unnecessary calls
  const memoizedOnEndReached = useCallback(
    info => {
      if (onEndReached && hasMore && !loading) {
        onEndReached(info);
      }
    },
    [onEndReached, hasMore, loading],
  );

  // Memoize footer component
  const ListFooterComponent = useCallback(() => {
    if (loading && !refreshing) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#007AFF" />
          {/* <Text style={styles.loadingText}>Loading more...</Text> */}
        </View>
      );
    }
    return null;
  }, [loading, refreshing]);

  // Memoize empty component
  const ListEmptyComponent = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }, [loading]);

  return (
    <FlatList
      data={processedData}
      renderItem={memoizedRenderItem}
      keyExtractor={memoizedKeyExtractor}
      getItemLayout={getItemLayout}
      onEndReached={memoizedOnEndReached}
      onEndReachedThreshold={0.5}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={ListEmptyComponent}
      // Memory optimization props
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={100}
      initialNumToRender={10}
      windowSize={10}
      // Performance props
      scrollEventThrottle={16}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  errorItem: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    margin: 8,
    borderRadius: 8,
  },
  errorText: {
    color: '#666',
    fontSize: 14,
  },
  footerLoader: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default MemoryOptimizedFlatList;
