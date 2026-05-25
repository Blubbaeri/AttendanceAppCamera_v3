import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { API_URLS } from '../config';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);

  if (!permission) {
    return (
      <View style={styles.container} collapsable={false}>
        <Text style={styles.infoText}>Memuat perizinan kamera ...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container} collapsable={false}>
        <Text style={styles.infoText}>
          Aplikasi butuh akses kamera untuk memindai QR Code Presensi Dosen!
        </Text>
        <TouchableOpacity style={styles.buttonRequest} onPress={requestPermission}>
          <Text style={styles.buttonText}>Aktifkan Kamera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    if (!isScanning) return;
    console.log("==> RAW QR DATA:", data);
    setIsScanning(false);

    try {
      // Pake trim() biar aman dari spasi gaib
      const qrData = JSON.parse(data.trim());

      Alert.alert(
        "QR Code Terdeteksi",
        `Mata Kuliah: ${qrData.kodeMk}\nPertemuan: ${qrData.pertemuanKe}\nRuangan: ${qrData.ruangan}\n\nLanjutkan Presensi (Check-In)?`,
        [
          {
            text: "Batal",
            onPress: () => setIsScanning(true),
            style: "cancel"
          },
          {
            text: "Ya, Check In",
            onPress: () => handleSubmitPresensi(qrData)
          }
        ]
      );
    } catch (error) {
      console.error("==> QR PARSE ERROR:", error);
      Alert.alert("QR Tidak Valid", "Pastikan Anda memindai QR Code Presensi Dosen.");
      setIsScanning(true);
    }
  };

  const handleSubmitPresensi = async (qrData) => {
    // Paksa semua data jadi string biar Backend seneng
    const payload = {
      kodeMk: String(qrData.kodeMk),
      nimMhs: "0325260031", // Simulasi NIM
      pertemuanKe: String(qrData.pertemuanKe),
      date: new Date().toISOString().split('T')[0],
      jamPresensi: new Date().toLocaleTimeString('en-GB'),
      status: "Present",
      ruangan: String(qrData.ruangan)
    };

    try {
      const response = await fetch(API_URLS.presensi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Berhasil!", "Presensi sukses dicatat ke Database.", [
          { text: "Lihat Riwayat", onPress: () => navigation.navigate('HistoryTab') }
        ]);
      } else {
        Alert.alert("Gagal Server", result.message || "Kesalahan API.");
      }
    } catch (error) {
      Alert.alert("Error Jaringan", "Pastikan IP Laptop benar.");
    } finally {
      setIsScanning(true);
    }
  };

  return (
    <View style={styles.container} collapsable={false}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />

      {/* Overlay dipindah ke luar CameraView pake positioning absolute */}
      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.unfocusedContainer}></View>
        <View style={styles.focusedContainer}>
          <View style={styles.borderCornerTopLeft} />
          <View style={styles.borderCornerTopRight} />
          <View style={styles.borderCornerBottomLeft} />
          <View style={styles.borderCornerBottomRight} />
        </View>
        <View style={styles.unfocusedContainer}>
          <Text style={styles.scanText}>Arahkan Kamera ke QR Code Dosen</Text>
          {!isScanning && (
            <Button title="Scan Lagi" onPress={() => setIsScanning(true)} color="#ffc107" />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  infoText: { color: 'white', textAlign: 'center', margin: 30, fontSize: 16 },
  buttonRequest: { backgroundColor: '#0056b3', padding: 15, borderRadius: 10, alignSelf: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },
  unfocusedContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  focusedContainer: { width: 250, height: 250, alignSelf: 'center', backgroundColor: 'transparent', position: 'relative' },
  scanText: { color: 'white', fontSize: 16, marginTop: 20, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.7)', padding: 10, borderRadius: 5 },
  borderCornerTopLeft: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTopWidth: 5, borderLeftWidth: 5, borderColor: '#007bff' },
  borderCornerTopRight: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTopWidth: 5, borderRightWidth: 5, borderColor: '#007bff' },
  borderCornerBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottomWidth: 5, borderLeftWidth: 5, borderColor: '#007bff' },
  borderCornerBottomRight: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 5, borderRightWidth: 5, borderColor: '#007bff' },
});
