import axios from 'axios';

// Base URL for API requests - change this to match your backend
const API_BASE_URL = 'http://localhost:5000/api';

// Types for API responses
export interface Device {
  id: string;
  name: string;
  type: 'light' | 'fan' | 'tv';
  isOn: boolean;
  level?: number;
}

export interface DeviceState {
  devices: Device[];
  lastGesture: string;
}

// Mock device state storage to persist changes between calls
const mockDevices: Device[] = [
  { id: 'light-1', name: 'Living Room Light', type: 'light', isOn: false },
  { id: 'fan-1', name: 'Ceiling Fan', type: 'fan', isOn: false, level: 0 },
  { id: 'tv-1', name: 'Smart TV', type: 'tv', isOn: false }
];

// API service functions
const api = {
  // Get all device states
  getDeviceStates: async (): Promise<DeviceState> => {
    try {
      // In a real implementation, this would fetch from the backend
      // const response = await axios.get(`${API_BASE_URL}/devices`);
      // return response.data;
      
      // Return the persisted mock data
      return {
        devices: mockDevices,
        lastGesture: ''
      };
    } catch (error) {
      console.error('Error fetching device states:', error);
      throw error;
    }
  },

  // Update a device state
  updateDevice: async (deviceId: string, state: Partial<Device>): Promise<Device> => {
    try {
      // In a real implementation, this would send to the backend
      // const response = await axios.post(`${API_BASE_URL}/devices/${deviceId}`, state);
      // return response.data;
      
      // Update the mock device in our persisted array
      const deviceIndex = mockDevices.findIndex(d => d.id === deviceId);
      if (deviceIndex !== -1) {
        mockDevices[deviceIndex] = {
          ...mockDevices[deviceIndex],
          ...state
        };
        return mockDevices[deviceIndex];
      }
      
      // If device not found, return a new mock device
      const newDevice = {
        id: deviceId,
        name: state.name || 'Device',
        type: state.type || 'light',
        isOn: state.isOn !== undefined ? state.isOn : false,
        level: state.level
      };
      return newDevice;
    } catch (error) {
      console.error(`Error updating device ${deviceId}:`, error);
      throw error;
    }
  },

  // Get video feed URL
  getVideoFeedUrl: (): string => {
    return `${API_BASE_URL}/video_feed`;
  }
};

export default api;