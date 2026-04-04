import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCameraPermissions, CameraView, CameraType } from "expo-camera";
import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import  BackButton  from '@/components/HeaderBar';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function Capture(){
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [firstUri, setFirstUri] = useState<string | null>(null);
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

        const image = await cameraRef.current.takePictureAsync({quality: 0.6, exif: true,});

        if(!firstUri){ //first capture
            setFirstUri(image.uri);
            Alert.alert('Fish Body Captured!', 'Next is Capture Gills, or Skip to Proceed', [{text: 'OK'}]);
        } else {
        router.push({ // Second capture, proceed to result
            pathname: "/scan/result",
            params: {
                uri: firstUri,
                uri2: image.uri,
                metadata: JSON.stringify(image.exif)}
        });
    }
}

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted){
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [3,4],
            quality: 0.6
        })

        console.log("Permission result: ", result)

        if (!result.canceled){
            const resultUri = result.assets[0].uri;
            setImage(resultUri)

            router.push({
            pathname: "/scan/result",
            params: { uri: resultUri, metadata: JSON.stringify(result.assets[0])}
            });
        }
    }

    function toggleCameraFacing(){
        setFacing(current => (current === 'back' ? 'front' : 'back'))
    }

    return(
        <View className="flex-1 bg-primary">
            <View className='absolute bg-primary w-full top-0 min-h-12'>
            </View>

            {/* Camera */}
            <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing}/>

            {/* Step Indicator */}
            <View className="absolute top-16 w-full items-center z-10">
                <Text className="text-white text-lg font-bold bg-black/50 px-4 py-2 rounded-full">
                    {firstUri ? 'Capture Gills (Recommended)' : 'Capture Fish Body'}
                </Text>
            </View>

            {/* Top Bar */}
            <BackButton onPress={() => router.push('/home')}/>

            {firstUri && ( //Retake Option (appears after capture)
                <TouchableOpacity
                    onPress={() => setFirstUri(null)}
                    className="absolute top-28 right-4 z-10 bg-red-500 px-3 py-1 rounded-full">
                    <Text className="text-white text-sm">Retake Body</Text>
                </TouchableOpacity>
            )}

            {firstUri && (
                <TouchableOpacity //Skip Button (appears after capture)
                    onPress={() => router.push({
                        pathname: '/scan/result',
                        params: { uri: firstUri, metadata: JSON.stringify({}) },
                    })}
                    className="absolute bottom-40 self-center z-10 bg-black/60 px-6 py-2 rounded-full">
                    <Text className="text-white font-semibold">Skip Gills</Text>
                </TouchableOpacity>
            )}

            {/* Bottom Icons */}
            <SafeAreaView>
            <View className="bg-primary absolute w-full flex-row items-center justify-between px-12 pt-4"
            style={{ bottom: insets.bottom}}>

                {/* Image Picker */}
                <TouchableOpacity onPress={pickImage} className=''>
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

