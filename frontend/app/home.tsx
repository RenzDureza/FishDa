import { View, Text, Button } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

const Home = () => {
  return (
    <SafeAreaProvider>
        <SafeAreaView className="flex-1 items-center justify-center bg-primary">
            <Text>Welcome</Text>
            <Button title="Go to Profile" onPress={() => router.push('/profile')} />
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Home