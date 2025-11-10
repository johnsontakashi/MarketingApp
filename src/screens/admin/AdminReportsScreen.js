import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AdminReportsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Reports</Text>
        <Text style={styles.subtitle}>Comprehensive business analytics and reports</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.placeholder}>
          <Ionicons name="bar-chart-outline" size={64} color="#6B7280" />
          <Text style={styles.placeholderTitle}>Admin Reports</Text>
          <Text style={styles.placeholderText}>
            This screen will provide detailed business reports, analytics, and insights across all system operations.
          </Text>
          
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• Sales performance reports</Text>
            <Text style={styles.featureItem}>• User engagement analytics</Text>
            <Text style={styles.featureItem}>• Device usage statistics</Text>
            <Text style={styles.featureItem}>• Revenue trend analysis</Text>
            <Text style={styles.featureItem}>• Exportable report formats</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    backgroundColor: '#2d2d2d',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  title: {
    color: '#D4AF37',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  placeholderTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  featureList: {
    alignSelf: 'stretch',
  },
  featureItem: {
    color: '#D4AF37',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
});