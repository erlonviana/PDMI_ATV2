import { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, 
  TouchableOpacity, Alert, ActivityIndicator 
} from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [dddCode, setDddCode] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!dddCode) {
      Alert.alert('Erro', 'Digite um código DDD');
      return;
    }
    
    if (!/^\d{2}$/.test(dddCode)) {
      Alert.alert('Erro', 'DDD deve ter exatamente 2 dígitos numéricos');
      return;
    }

    setLoading(true);
    
    try {
      router.push(`/ddd/${dddCode}`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível realizar a consulta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>📞 Consulta por DDD - Érlon Viana dos Santos - DSM4</Text>
        <Text style={styles.subtitle}>
          Digite o código de área para encontrar as cidades
        </Text>
        
        <TextInput
          style={styles.input}
          placeholder="Ex: 11, 13, 21"
          placeholderTextColor="#999"
          value={dddCode}
          onChangeText={setDddCode}
          keyboardType="numeric"
          maxLength={2}
        />
        
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Buscar Cidades</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 50,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  button: {
    height: 50,
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A5A5FF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});