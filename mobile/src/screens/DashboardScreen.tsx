import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchTransactionStats } from '../store/slices/transactionSlice';

const DashboardScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { stats, statsLoading, error } = useSelector((state: RootState) => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactionStats({ months: 12 }));
  }, [dispatch]);

  if (statsLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noDataText}>No data available</Text>
      </View>
    );
  }

  const getAdviceColor = (advice: string) => {
    if (advice.includes('Excellent')) return '#10B981';
    if (advice.includes('Good balance')) return '#3B82F6';
    if (advice.includes('quite high')) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Financial Dashboard</Text>
      
      {/* Main Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#DBEAFE' }]}>
          <Text style={styles.statLabel}>Total Needs</Text>
          <Text style={[styles.statValue, { color: '#2563EB' }]}>
            ${stats.totalNeeds.toFixed(2)}
          </Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: '#F3E8FF' }]}>
          <Text style={styles.statLabel}>Total Wants</Text>
          <Text style={[styles.statValue, { color: '#9333EA' }]}>
            ${stats.totalWants.toFixed(2)}
          </Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: '#D1FAE5' }]}>
          <Text style={styles.statLabel}>Needs %</Text>
          <Text style={[styles.statValue, { color: '#059669' }]}>
            {stats.needsPercentage.toFixed(1)}%
          </Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: '#FED7AA' }]}>
          <Text style={styles.statLabel}>Wants %</Text>
          <Text style={[styles.statValue, { color: '#EA580C' }]}>
            {stats.wantsPercentage.toFixed(1)}%
          </Text>
        </View>
      </View>

      {/* Visual Breakdown */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Needs vs Wants Breakdown</Text>
        
        <View style={styles.progressBarContainer}>
          <Text style={styles.progressLabel}>Needs</Text>
          <Text style={styles.progressValue}>
            ${stats.totalNeeds.toFixed(2)} ({stats.needsPercentage.toFixed(1)}%)
          </Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBar, 
              { backgroundColor: '#2563EB', width: `${Math.min(stats.needsPercentage, 100)}%` }
            ]}
          />
        </View>
        
        <View style={styles.progressBarContainer}>
          <Text style={styles.progressLabel}>Wants</Text>
          <Text style={styles.progressValue}>
            ${stats.totalWants.toFixed(2)} ({stats.wantsPercentage.toFixed(1)}%)
          </Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBar, 
              { backgroundColor: '#9333EA', width: `${Math.min(stats.wantsPercentage, 100)}%` }
            ]}
          />
        </View>
      </View>

      {/* Financial Advice */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Financial Advice</Text>
        <Text style={[styles.adviceText, { color: getAdviceColor(stats.financialAdvice) }]}>
          {stats.financialAdvice}
        </Text>
        <View style={styles.targetContainer}>
          <Text style={styles.targetText}>
            Target: 70% Needs, 30% Wants for optimal financial health
          </Text>
        </View>
      </View>

      {/* Monthly Breakdown */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly Breakdown</Text>
        {stats.monthlyData.map((month, index) => (
          <View key={index} style={styles.monthlyRow}>
            <View style={styles.monthInfo}>
              <Text style={styles.monthName}>{month.month}</Text>
              <Text style={styles.monthYear}>{month.year}</Text>
            </View>
            <View style={styles.monthStats}>
              <Text style={styles.monthStat}>N: ${month.needs.toFixed(2)}</Text>
              <Text style={styles.monthStat}>W: ${month.wants.toFixed(2)}</Text>
              <Text style={styles.monthStat}>T: ${month.total.toFixed(2)}</Text>
              <Text style={styles.monthStat}>N%: {month.needsPercentage.toFixed(1)}%</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#6B7280',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  progressBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  progressValue: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressBarBackground: {
    height: 32,
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adviceText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  targetContainer: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 6,
  },
  targetText: {
    fontSize: 14,
    color: '#6B7280',
  },
  monthlyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  monthInfo: {
    flex: 1,
  },
  monthName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  monthYear: {
    fontSize: 12,
    color: '#6B7280',
  },
  monthStats: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthStat: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default DashboardScreen;