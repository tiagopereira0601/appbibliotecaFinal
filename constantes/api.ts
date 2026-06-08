import { Platform } from 'react-native';

/**
 * API host selection:
 * - Web: localhost
 * - Android emulator (AVD): 10.0.2.2 (special internal IP)
 * - iOS simulator: localhost
 * - Physical device: set LAN_IP below to your computer IP (e.g., 192.168.0.100)
 *
 * Edit LAN_IP if using a physical device on the same Wi‑Fi network.
 */

// CONFIGURE AQUI seu IP local para device físico
const LAN_IP = ""; // Deixe vazio para emulador, ou coloque tipo: "192.168.0.100"

const API = Platform.OS === 'web'
  ? `http://localhost:3001`
  : Platform.OS === 'android'
    ? (LAN_IP ? `http://${LAN_IP}:3001` : `http://10.0.2.2:3001`)
    : (LAN_IP ? `http://${LAN_IP}:3001` : 'http://localhost:3001');

console.log(`[API] Plataforma: ${Platform.OS}`);
console.log(`[API] URL sendo usada: ${API}`);
console.log(`[API] LAN_IP configurado: ${LAN_IP || 'não configurado (usando padrão)'}`);

export { API, LAN_IP };
