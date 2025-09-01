import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';

interface CameraFeedProps {
  onGestureDetected?: (gesture: string) => void;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ onGestureDetected }) => {
  const webcamRef = useRef<Webcam>(null);
  
  // In a real implementation, this would connect to the backend
  // and process gestures from the video feed
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate gesture detection (in real app, this would come from backend)
      const gestures = ['✋', '👍', '👎', '👉'];
      const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
      
      if (onGestureDetected) {
        onGestureDetected(randomGesture);
      }
    }, 5000); // Simulate a gesture detection every 5 seconds
    
    return () => clearInterval(interval);
  }, [onGestureDetected]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-xl font-semibold mb-3">
        Camera Feed
      </h2>
      <div className="relative w-full h-[300px]">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: "user"
          }}
          className="w-full h-full object-cover rounded-lg"
        />
        <div 
          className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded"
        >
          <span className="text-sm">
            Live Feed
          </span>
        </div>
      </div>
    </div>
  );
};

export default CameraFeed;