import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type HeaderBarProps = {
    onPress: () => void;
    size?: number;
    color?: string;
    style?: object;
    title?: string;
    titleColor?: string;
    titleSize?: number;
};

export default function HeaderBar({
    onPress,
    size = 48,
    color = 'black',
    style = {},
    title,
    titleColor = 'bg-tertiary',
    titleSize = 30,
}: HeaderBarProps) {
    const insets = useSafeAreaInsets();
    return(
        <SafeAreaView edges={['top']} className="absolute top-0 w-full">
            <View className={`flex-row items-center ${title ? 'justify-between' : 'justify-start'} px-4`} style={{ paddingTop: insets.top, height: 70}}>
                
                <TouchableOpacity onPress={onPress} style={style} className=''>
                    <Ionicons name="arrow-back-outline" size={size} color={color} /> 
                </TouchableOpacity>

                {title && (
                    <View>
                        <Text className={`font-bold`}
                        style={{ fontSize: titleSize, color: titleColor}}
                        >
                        {title}
                        </Text>
                    </View>
                )}

                {title && <View style={{ width: size}}/>}                   
            </View>
        </SafeAreaView>
    );
}