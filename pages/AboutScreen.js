import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';

import { CameraView, useCameraPermissions } from 'expo-camera';
import { API_URLS } from '../config';

export default function AboutScreen() {

    const [permission, requestPermission] = useCameraPermissions();
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [mahasiswa, setMahasiswa] = useState(null);

    const cameraRef = useRef(null);

    // GANTI DENGAN NIM LU
    const NIM_USER = '0920240017';
    const NAMA_USER = 'Muhammad Ghadir Ridho';

    useEffect(() => {
        fetchMahasiswa();
    }, []);

    const fetchMahasiswa = async () => {
        try {
            const response = await fetch(
                `${API_URLS.mahasiswa}/${NIM_USER}`
            );

            const data = await response.json();

            if (response.ok) {
                setMahasiswa(data);
            }
        } catch (error) {
            console.log('Gagal mengambil data mahasiswa', error);
        }
    };

    const uploadPhoto = async (photoUri) => {
        try {
            const formData = new FormData();

            formData.append('nim', NIM_USER);
            formData.append('nama', NAMA_USER);

            formData.append('foto', {
                uri: photoUri,
                name: 'profile.jpg',
                type: 'image/jpeg',
            });

            const response = await fetch(
                `${API_URLS.mahasiswa}/upload`,
                {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                Alert.alert(
                    'Berhasil',
                    data.message
                );

                fetchMahasiswa();
            } else {
                Alert.alert(
                    'Error',
                    data.message
                );
            }
        } catch (error) {
            Alert.alert(
                'Error',
                'Gagal upload foto.'
            );
        }
    };

    const takePicture = async () => {

        if (cameraRef.current) {
            try {

                const photo =
                    await cameraRef.current
                        .takePictureAsync({
                            quality: 0.3,
                        });

                setIsCameraOpen(false);

                await uploadPhoto(photo.uri);

            } catch (error) {
                Alert.alert(
                    'Error',
                    'Gagal mengambil foto selfie.'
                );
            }
        }
    };

    if (isCameraOpen) {

        if (!permission) {
            return (
                <View style={styles.container}>
                    <Text>Memuat perizinan...</Text>
                </View>
            );
        }

        if (!permission.granted) {
            return (
                <View style={styles.container}>

                    <Text style={styles.infoText}>
                        Kami butuh akses kamera.
                    </Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={requestPermission}
                    >
                        <Text style={styles.buttonText}>
                            Beri Izin Kamera
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonDanger}
                        onPress={() =>
                            setIsCameraOpen(false)
                        }
                    >
                        <Text style={styles.buttonText}>
                            Batal
                        </Text>
                    </TouchableOpacity>

                </View>
            );
        }

        return (
            <View style={styles.container}>
                <CameraView
                    style={StyleSheet.absoluteFillObject}
                    facing="front"
                    ref={cameraRef}
                >
                    <View style={styles.cameraOverlay}>
                        <View style={styles.captureContainer}>

                            <TouchableOpacity
                                style={styles.captureButton}
                                onPress={takePicture}
                            >
                                <Text style={styles.captureButtonText}>
                                    Jepret
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() =>
                                    setIsCameraOpen(false)
                                }
                            >
                                <Text style={styles.buttonText}>
                                    Batal
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </CameraView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.profileCard}>

                <View style={styles.imageContainer}>
                    <Image
                        source={{
                            uri:
                                mahasiswa?.fotoMhs
                                    ? `data:image/jpeg;base64,${mahasiswa.fotoMhs}`
                                    : null,
                        }}
                        style={styles.profileImage}
                    />
                </View>

                <Text style={styles.nameText}>
                    {mahasiswa?.namaMhs || 'Nama Mahasiswa'}
                </Text>

                <Text style={styles.nimText}>
                    NIM: {NIM_USER}
                </Text>

                <Text style={styles.programText}>
                    Mobile Programming - React Native
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                        setIsCameraOpen(true)
                    }
                >
                    <Text style={styles.buttonText}>
                        Ganti Foto Selfie
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f9',
        justifyContent: 'center',
        alignItems: 'center',
    },

    profileCard: {
        backgroundColor: 'white',
        width: '85%',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        elevation: 5,
    },

    imageContainer: {
        marginBottom: 20,
    },

    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: '#0056b3',
    },

    nameText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },

    nimText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },

    programText: {
        fontSize: 14,
        color: '#0056b3',
        fontWeight: 'bold',
        marginBottom: 25,
        textAlign: 'center',
    },

    button: {
        backgroundColor: '#0056b3',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },

    buttonDanger: {
        backgroundColor: '#dc3545',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },

    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },

    infoText: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 16,
    },

    cameraOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
    },

    captureContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: 40,
    },

    captureButton: {
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        elevation: 5,
    },

    captureButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },

    cancelButton: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
    },
});