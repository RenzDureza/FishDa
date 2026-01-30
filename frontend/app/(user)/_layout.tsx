import { Slot, Redirect } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UserLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!session) return <Redirect href="/(auth)/signin" />;

  return <Slot />;
}
