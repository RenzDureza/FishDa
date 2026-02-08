import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCameraPermissions, CameraView, CameraType } from "expo-camera";
import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import  BackButton  from '@/components/HeaderBar';
import { router } from 'expo-router';

export default function Capture(){
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const insets = useSafeAreaInsets();

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

    const captureImage = async () => {
        console.log("Camera Ref: ", cameraRef);
        if (!cameraRef.current) return;

        const image = await cameraRef.current.takePictureAsync({
            quality: 0.6,
            exif: true,
        });

        router.push({
            pathname: "/viewImage",
            params: { uri: image.uri, metadata: JSON.stringify(image.exif)}
        });
    }

    function toggleCameraFacing(){
        setFacing(current => (current == 'back' ? 'front' : 'back'))
    }

    return(
        <View className="flex-1 bg-primary">
            {/* Camera */}
            <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing}/>

            {/* Top Bar */}
            <BackButton onPress={() => router.push('/(main)/home')} />                      

            {/* Bottom Icons */}
            <SafeAreaView>
            <View className="bg-primary absolute w-full flex-row items-center justify-between px-12 pt-4"
            style={{ bottom: insets.bottom}}>

                {/* Image Picker */}
                <TouchableOpacity className=''>
                    <Ionicons name="images-outline" size={51} color="black" />                        
                </TouchableOpacity>

                {/* Capture Image */}
                <TouchableOpacity
                    onPress={captureImage}
                    className='h-20 w-20 rounded-full bg-white border-4 border-black'
                />

                {/* Flip Camera */}
                <TouchableOpacity onPress={toggleCameraFacing}>
                    <Ionicons name="camera-reverse-outline" size={51} color="black" /> 
                </TouchableOpacity>

            </View>
            </SafeAreaView>
            

        </View>
    );
}

