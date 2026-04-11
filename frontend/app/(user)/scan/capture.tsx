import { View, Text, TouchableOpacity, Alert, Dimensions, StyleSheet} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCameraPermissions, CameraView, CameraType } from "expo-camera";
import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import  BackButton  from '@/components/HeaderBar';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Defs, Mask, Rect, Circle} from 'react-native-svg';

export default function Capture(){
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [firstUri, setFirstUri] = useState<string | null>(null);
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const insets = useSafeAreaInsets();
    const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

    // Fish Box Dimensions
    const BOX_WIDTH = screenWidth * 0.6;
    const BOX_HEIGHT = screenHeight * 0.66;
    const BOX_X = screenWidth * 0.2;
    const BOX_Y = (screenHeight - BOX_HEIGHT) / 2;

    // Gills Dimensions
    const CIRCLE_RADIUS = 120;
    const CIRCLE_CX = screenWidth / 2;
    const CIRCLE_CY = screenHeight / 2;

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
        <View className="flex-1">
            {/* Camera */}
            <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing}/>

            {/* Overlay */}
           {!firstUri ? (

            <View style={StyleSheet.absoluteFill} pointerEvents='none'>
                <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                    <Defs>
                        <Mask id="fishMask">
                            <Rect width="100%" height="100%" fill="white"/>
                            <Rect
                                x= {BOX_X}
                                y= {BOX_Y}
                                width={BOX_WIDTH}
                                height={BOX_HEIGHT}
                                rx = "12"
                                fill = "black"
                            />
                        </Mask>
                    </Defs>
                        <Rect
                        width="100%"
                        height="100%"
                        fill="rgba(0,0,0,0.55)"
                        mask="url(#fishMask)"
                        />
                </Svg>

                <View style={{
                    position: "absolute",
                    left: BOX_X,
                    top: BOX_Y,
                    width: BOX_WIDTH,
                    height: BOX_HEIGHT,
                    borderWidth: 2,
                    borderColor: "white",
                    borderRadius: 12,
                }}>

                </View>

            </View>

           ) : (

            <View style={StyleSheet.absoluteFill} pointerEvents='none'>
                <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                    <Defs>
                        <Mask id="gillsMask">
                            <Rect width="100%" height="100%" fill="white"/>
                            <Circle
                                cx = {CIRCLE_CX}
                                cy = {CIRCLE_CY}
                                r = {CIRCLE_RADIUS}
                                fill = "black"
                            />
                        </Mask>
                    </Defs>
                        <Rect
                        width="100%"
                        height="100%"
                        fill="rgba(0,0,0,0.55)"
                        mask="url(#gillsMask)"
                        />
                </Svg>

                <View style={{
                    position: "absolute",
                    left: CIRCLE_CX - CIRCLE_RADIUS,
                    top: CIRCLE_CY - CIRCLE_RADIUS,
                    width: CIRCLE_RADIUS * 2,
                    height: CIRCLE_RADIUS * 2,
                    borderWidth: 2,
                    borderColor: "white",
                    borderRadius: CIRCLE_RADIUS,
                }}>

                </View>
            </View>

           )}

           <View style={{ flex: 1, justifyContent: 'space-between' }}>
                {/* Top Bar */}
                <SafeAreaView>
                    <View className="absolute top-12 w-full items-center z-10">
                        <Text className="text-white text-lg font-bold bg-black/50 px-4 py-4 rounded-full">
                            {firstUri ? 'Capture Gills (Recommended)' : 'Capture Fish Body'}
                        </Text>
                    </View>
                </SafeAreaView>

                {/* Bottom Area */}
                <SafeAreaView>
                    <View className="absolute w-full flex-row items-center justify-between px-12 py-6 pt-4"
                        style={{ bottom: insets.bottom}}>

                        <TouchableOpacity onPress={pickImage}>
                            <Ionicons name="images-outline" size={51} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                        onPress={captureImage}
                        className='h-14 w-14 rounded-full bg-white py-6'/>

                        <TouchableOpacity onPress={toggleCameraFacing}>
                            <Ionicons name="camera-reverse-outline" size={51} color="white" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>

            {/* Post Body Capture */}
            {firstUri && (
                <TouchableOpacity
                    onPress={() => setFirstUri(null)}
                    className="absolute top-28 right-4 z-10 bg-red-500 px-3 py-1 rounded-full">
                    <Text className="text-white text-sm">Retake Body</Text>
                </TouchableOpacity>
            )}

            {firstUri && (
                <TouchableOpacity
                    onPress={() => router.push({
                        pathname: '/scan/result',
                        params: { uri: firstUri, metadata: JSON.stringify({}) },
                    })}
                    className="absolute bottom-40 self-center z-10 bg-black/60 px-6 py-2 rounded-full">
                    <Text className="text-white font-semibold">Skip Gills</Text>
                </TouchableOpacity>
            )}

            <BackButton onPress={() => router.push('/home')}/>

        </View>
    );
}