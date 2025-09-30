'use client';
import { useRef, useState } from 'react';

interface CameraCaptureProps {
  onCapture: (photoBase64: string) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Iniciar cámara
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      alert('No se pudo acceder a la cámara');
    }
  };

  // Tomar foto
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      const photoBase64 = canvas.toDataURL('image/jpeg', 0.8);
      stopCamera();
      onCapture(photoBase64);
    }
  };

  // Detener cámara
  const stopCamera = () => {
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 relative">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <div className="p-4 bg-gray-900 flex justify-around">
        {!stream ? (
          <button 
            onClick={startCamera}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Iniciar Cámara
          </button>
        ) : (
          <>
            <button 
              onClick={capturePhoto}
              className="px-6 py-3 bg-green-600 text-white rounded-lg"
            >
              📷 Tomar Foto
            </button>
            <button 
              onClick={handleClose}
              className="px-6 py-3 bg-red-600 text-white rounded-lg"
            >
              Cerrar
            </button>
          </>
        )}
      </div>
    </div>
  );
}