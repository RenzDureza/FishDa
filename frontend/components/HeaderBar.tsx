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
    bgColor?: string;
};

export default function HeaderBar({
    onPress,
    size = 40,
    color = 'black',
    style = {},
    title,
    titleColor = 'bg-tertiary',
    titleSize = 28,
    bgColor
}: HeaderBarProps) {
    const insets = useSafeAreaInsets();
    return(
        <SafeAreaView edges={['top']} className="absolute top-0 w-full">
            <View className={`flex-row items-center ${title ? 'justify-between' : 'justify-start'} px-4`} style={{ paddingTop: insets.top, height: 70}}>
                
                <TouchableOpacity onPress={onPress} style={style}>
                    <Ionicons name="arrow-back-outline" size={size} color={color} /> 
                </TouchableOpacity>

                {title && (
                    <View>
                        <Text className={`font-extrabold`}
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