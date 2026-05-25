// config.js
// GANTI DENGAN IP LAPTOP / WIFI SEKARANG (contoh: 10.1.10.140 atau 192.168.1.15)
export const IP_LAPTOP = "10.1.10.140";

// Base API URL
export const BASE_API_URL = `http://${IP_LAPTOP}:8080/api`;

// Endpoint URLs
export const API_URLS = {
  presensi: `${BASE_API_URL}/presensi`,
  mahasiswa: `${BASE_API_URL}/mahasiswa`,
};
