import { View, Text, Image, ScrollView } from 'react-native'
import React from 'react'
import { router, useGlobalSearchParams } from 'expo-router'
import HeaderBar from '@/components/HeaderBar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { cssInterop } from 'nativewind';
cssInterop(Image, {className: 'style'});

export default function viewImage () {
    const { uri, metadata } = useGlobalSearchParams<{ uri: string; metadata: string}>();
    const parsedMetadata = metadata ? JSON.parse(metadata) : null;
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView edges={['top']} className='flex-1 bg-primary items-center'>

            {uri && (
                <View style={{alignItems: "center"}}>
                    <Image
                    source={{ uri }}
                    style={{ width: '100%', aspectRatio: 1}}
                    resizeMode="contain"
                    />
                </View> 
            )}
            
            {parsedMetadata && (
                <ScrollView className="w-10/12 rounded-xl bg-secondary py-4 px-6"
                        contentContainerStyle={{paddingBottom: insets.bottom + 16}}
                        style={{flex: 1}}>
                {Object.entries(parsedMetadata).map(([key, value]) => (
                    <Text key={key} className='text-black mb-2'>
                        {key}: {value?.toString()}
                    </Text>
                ))}
                </ScrollView>
            )}

            <HeaderBar onPress={() => router.back()} title='Image'/>
            
        </SafeAreaView>
    )
}