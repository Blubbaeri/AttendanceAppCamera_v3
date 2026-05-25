import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { API_URLS } from '../config';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URLS.presensi);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchHistory();
    }
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.courseCode}>{item.kodeMk}</Text>
        <Text style={styles.statusBadge}>{item.status}</Text>
      </View>
      <Text style={styles.detailText}>Pertemuan: {item.pertemuanKe}</Text>
      <Text style={styles.detailText}>Ruangan: {item.ruangan}</Text>
      <Text style={styles.dateText}>{item.date} | {item.jamPresensi}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riwayat Presensi</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Belum ada riwayat presensi.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  courseCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statusBadge: {
    backgroundColor: '#e1f5fe',
    color: '#0288d1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
    fontSize: 16,
  },
});
