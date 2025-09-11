import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

// Map untuk tracking toast yang sudah ditampilkan
const displayedToasts = new Map<string, number>();

// Fungsi untuk membersihkan toast yang sudah expired
const cleanupExpiredToasts = () => {
  const now = Date.now();
  for (const [key, timestamp] of displayedToasts.entries()) {
    if (now - timestamp > 3000) { // 3 detik
      displayedToasts.delete(key);
    }
  }
};

export const errorHandler = (error: any) => {
  // Cleanup expired toasts
  cleanupExpiredToasts();

  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    
    // Handle 401 errors khusus
    if (status === 401) {
      const toastKey = 'token_expired_401';
      const now = Date.now();
      
      // Cek apakah toast sudah ditampilkan dalam 3 detik terakhir
      if (!displayedToasts.has(toastKey) || (now - displayedToasts.get(toastKey)!) > 3000) {
        toast.error('Token Expired');
        displayedToasts.set(toastKey, now);
      }
      return;
    }
    
    // Handle error lainnya
    const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
    const toastKey = `error_${status}_${message}`;
    const now = Date.now();
    
    // Cek apakah toast yang sama sudah ditampilkan dalam 3 detik terakhir
    if (!displayedToasts.has(toastKey) || (now - displayedToasts.get(toastKey)!) > 3000) {
      toast.error(message);
      displayedToasts.set(toastKey, now);
    }
  } else if (error.request) {
    // Request was made but no response received
    const toastKey = 'network_error';
    const now = Date.now();
    
    if (!displayedToasts.has(toastKey) || (now - displayedToasts.get(toastKey)!) > 3000) {
      toast.error('Network error. Please check your connection.');
      displayedToasts.set(toastKey, now);
    }
  } else {
    // Something else happened
    const message = error.message || 'An unexpected error occurred';
    const toastKey = `general_error_${message}`;
    const now = Date.now();
    
    if (!displayedToasts.has(toastKey) || (now - displayedToasts.get(toastKey)!) > 3000) {
      toast.error(message);
      displayedToasts.set(toastKey, now);
    }
  }

  console.error('Error details:', error);
};
