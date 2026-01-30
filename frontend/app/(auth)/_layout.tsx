import { Slot, Redirect } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (session) return <Redirect href="/(user)/home" />;

  return <Slot />;
}
