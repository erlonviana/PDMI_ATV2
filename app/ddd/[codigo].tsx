import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, FlatList } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

// Interface para tipagem da API
interface DDDResponse {
  state: string;
  cities: string[];
}

export default function DDDResultScreen() {
  const { codigo } = useLocalSearchParams<{ codigo: string }>();
  const dddCode = codigo || '';
  
  const [data, setData] = useState<DDDResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCities() {
      if (!dddCode) {
        setError('Código DDD não informado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`https://brasilapi.com.br/api/ddd/v1/${dddCode}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('DDD não encontrado');
          }
          throw new Error('Erro na consulta');
        }
        
        const result: DDDResponse = await response.json();
        
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Erro desconhecido');
          Alert.alert(
            'Erro na Consulta',
            err instanceof Error ? err.message : 'Não foi possível buscar as cidades',
            [{ text: 'Voltar', onPress: () => router.back() }]
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCities();

    return () => {
      isMounted = false;
    };
  }, [dddCode]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Buscando cidades...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubtext}>
          Verifique o código DDD e tente novamente
        </Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>🔍</Text>
        <Text style={styles.errorText}>Nenhum resultado encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.dddHeader}>
        <Text style={styles.dddCode}>DDD {dddCode}</Text>
      </View>
      
      <View style={styles.header}>
        <Text style={styles.stateTitle}>Estado: {data.state}</Text>
        <Text style={styles.cityCount}>
          {data.cities.length} cidade{data.cities.length !== 1 ? 's' : ''} encontrada{data.cities.length !== 1 ? 's' : ''}
        </Text>
      </View>
      
      <FlatList
        data={data.cities}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.cityItem}>
            <Text style={styles.cityName}>📍 {item}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dddHeader: {
    marginBottom: 20,
    alignItems: 'center',
  },
  dddCode: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  header: {
    backgroundColor: '#6C63FF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  stateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cityCount: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  cityItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cityName: {
    fontSize: 16,
    color: '#2D3436',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#636E72',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    marginTop: 8,
  },
});