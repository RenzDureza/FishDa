import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useCameraPermissions, CameraView, CameraType } from "expo-camera";
import { useEffect, useState } from 'react';

export default function Capture(){
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission, requestPermission]);

    if (!permission){
        return (
            <View className='flex-1 items-center justify-center'>
                <Text>Requesting for camera permission...</Text>
            </View>
        );
    }

    if(!permission.granted){
        return(
            <View className='flex-1 items-center justify-center px-6'>
                <Text>Camera access is required.</Text>
                <TouchableOpacity
                    onPress={requestPermission}
                    className='rounded bg-black px-4 py-2'
                >
                    <Text className='text-white'>Grant Permission.</Text>
                </TouchableOpacity>
            </View>
        );
    }

    function toggleCameraFacing(){
        setFacing(current => (current == 'back' ? 'front' : 'back'))
    }

    return(
        <View className="flex-1 justify-center">
            <CameraView style={{ height: '60%' , width: '100%'}} facing={facing}/>
            {/* <CameraView style={{ flex: 1 }} facing={facing}/> */}
            <View className='absolute bottom-16 flex-row bg-transparent w-full px-16'>
                <TouchableOpacity className='flex-1 items-center' onPress={toggleCameraFacing}>
                    <Text className='text-2xl font-bold text-black'>Flip Camera</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

