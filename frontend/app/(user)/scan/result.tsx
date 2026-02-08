import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { router, useGlobalSearchParams } from 'expo-router'
import HeaderBar from '@/components/HeaderBar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function viewImage () {
    const { uri, metadata } = useGlobalSearchParams<{ uri: string; metadata: string}>();
    const parsedMetadata = metadata ? JSON.parse(metadata) : null;
    const insets = useSafeAreaInsets();
    const score = Math.floor(Math.random() * 100);

    return (
        <SafeAreaView edges={['top']} className='flex-1 bg-primary items-center'>
            <SafeAreaView className='flex-1 bg-primary w-full max-h-0'>
            </SafeAreaView>

            {uri && (
                <View style={{flex: 1 , alignItems: "center"}}>
                    <Image
                    source={{ uri }}
                    style={{ width: '70%', aspectRatio: 1}}
                    resizeMode="contain"
                    />
                </View> 
            )}

            <View className='flex-1 bg-primary justify-center items-center max-h-24'>
                <Text className='text-3xl font-extrabold'>Surface Quality Score:</Text>
                <Text className='text-3xl font-extrabold'>{score}</Text>
            </View>
            
            {parsedMetadata && (
                <ScrollView className="flex-1 w-10/12 rounded-xl bg-secondary py-2 px-6 mb-2 overflow-hidden border-2 border-tertiary"
                        contentContainerStyle={{paddingBottom: insets.bottom + 16}}>
                    <Text className='mb-2 font-semibold'>Metadata:</Text>
                {Object.entries(parsedMetadata).map(([key, value]) => (
                    <Text key={key} className='text-black mb-2'>
                        {key}: {value?.toString()}
                    </Text>
                ))}
                </ScrollView>
            )}

            <SafeAreaView edges={['bottom']} className="w-full py-2 pb-2">
                <View className={'flex-row items-center justify-end px-4'}>
                    
                    <TouchableOpacity onPress={() => router.push('/home')} style={styles.button}>
                        <Text>Back to Sea</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/scan/capture')} style={styles.button} >
                        <Text className=''>Scan Again</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {}} style={styles.button}>
                        <Text>Send Feedback</Text>
                    </TouchableOpacity>
                 
                </View>
            </SafeAreaView>

            <HeaderBar onPress={() => router.back()} title='Fish' />
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 3
    }
});