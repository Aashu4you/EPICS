import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

interface CameraFeedProps {
  onGestureDetected?: (gesture: string) => void;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ onGestureDetected }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState<boolean>(true);
  const [key, setKey] = useState<number>(0); // Add a key to force remount of webcam
  
  // Check if camera is active by monitoring the video element
  useEffect(() => {
    let statusInterval: NodeJS.Timeout;
    
    if (isCameraEnabled) {
      const checkCameraStatus = () => {
        if (webcamRef.current && webcamRef.current.video) {
          const videoElement = webcamRef.current.video;
          // Check if video is playing and has dimensions
          const isActive = !!(videoElement.readyState >= 2 && 
                            videoElement.videoWidth > 0 && 
                            videoElement.videoHeight > 0);
          setIsCameraActive(isActive);
        } else {
          setIsCameraActive(false);
        }
      };
      
      // Check initially and then periodically
      checkCameraStatus();
      statusInterval = setInterval(checkCameraStatus, 1000);
    } else {
      setIsCameraActive(false);
    }
    
    return () => {
      if (statusInterval) clearInterval(statusInterval);
    };
  }, [isCameraEnabled, key]);
  
  // Only simulate gesture detection when camera is active
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isCameraActive && isCameraEnabled) {
      interval = setInterval(() => {
        // Simulate gesture detection (in real app, this would come from backend)
        const gestures = ['✋', '👍', '👎', '👉'];
        const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
        
        if (onGestureDetected) {
          onGestureDetected(randomGesture);
        }
      }, 5000); // Simulate a gesture detection every 5 seconds
    } else if (!isCameraEnabled && onGestureDetected) {
      // Clear any current gesture when camera is disabled
      onGestureDetected('');
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCameraActive, isCameraEnabled, onGestureDetected]);

  // Toggle camera on/off
  const toggleCamera = useCallback(() => {
    if (isCameraEnabled) {
      // Turning off
      setIsCameraEnabled(false);
      if (onGestureDetected) {
        onGestureDetected('');
      }
    } else {
      // Turning on - force remount of webcam component
      setKey(prevKey => prevKey + 1);
      setIsCameraEnabled(true);
    }
  }, [isCameraEnabled, onGestureDetected]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">
          Camera Feed
        </h2>
        <button
          onClick={toggleCamera}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            isCameraEnabled 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isCameraEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
        </button>
      </div>
      <div className="relative w-full h-[300px]">
        {isCameraEnabled ? (
          <Webcam
            key={key} // Add key to force remount
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 640,
              height: 480,
              facingMode: "user"
            }}
            className="w-full h-full object-cover rounded-lg"
            onUserMediaError={(err) => {
              console.error("Camera error:", err);
              setIsCameraActive(false);
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <p className="mt-2 text-gray-600">Camera is turned off</p>
            </div>
          </div>
        )}
        <div 
          className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded"
        >
          <span className="text-sm">
            {isCameraActive && isCameraEnabled ? 'Live Feed' : 'Camera Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CameraFeed;