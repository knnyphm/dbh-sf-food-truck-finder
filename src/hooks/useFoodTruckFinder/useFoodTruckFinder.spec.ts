import { renderHook, act } from '@testing-library/react';
import { useFoodTruckFinder } from './useFoodTruckFinder';
import { fetchNearbyTrucks } from '@/utils/foodTruckLocator';

// Mock the foodTruckLocator module
jest.mock('@/utils/foodTruckLocator', () => ({
  fetchNearbyTrucks: jest.fn(),
}));

// Mock the geolocation API
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
};

beforeAll(() => {
  // Setup navigator mock
  const mockNavigator = {
    geolocation: mockGeolocation,
  };
  
  Object.defineProperty(global, 'navigator', {
    value: mockNavigator,
    writable: true,
  });
});

describe('useFoodTruckFinder', () => {
  const mockTrucks = [
    {
      applicant: 'Test Truck 1',
      locationdescription: 'Test Location 1',
      latitude: 37.7749,
      longitude: -122.4194,
      fooditems: 'Test Food 1',
    },
    {
      applicant: 'Test Truck 2',
      locationdescription: 'Test Location 2',
      latitude: 37.7750,
      longitude: -122.4195,
      fooditems: 'Test Food 2',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchNearbyTrucks as jest.Mock).mockResolvedValue(mockTrucks);
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFoodTruckFinder());

    expect(result.current.trucks).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.locating).toBe(false);
    expect(result.current.userLocation).toBe(null);
    expect(result.current.locationError).toBe(null);
    expect(result.current.radiusMiles).toBe(1);
    expect(typeof result.current.clearLocationError).toBe('function');
  });

  it('should load trucks successfully', async () => {
    const { result } = renderHook(() => useFoodTruckFinder());

    await act(async () => {
      await result.current.getNearbyTrucks({ latitude: 37.7749, longitude: -122.4194 });
    });

    expect(fetchNearbyTrucks).toHaveBeenCalledWith(37.7749, -122.4194, 1);
    expect(result.current.trucks).toEqual(mockTrucks);
    expect(result.current.loading).toBe(false);
  });

  it('should handle getCurrentLocation success', async () => {
    const mockCoords = { latitude: 37.7749, longitude: -122.4194 };
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      setTimeout(() => success({ coords: mockCoords }), 0);
    });

    const { result } = renderHook(() => useFoodTruckFinder());

    await act(async () => {
      const trucksPromise = result.current.getNearbyTrucks();
      await trucksPromise;
    });

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    expect(result.current.userLocation).toEqual(mockCoords);
    expect(result.current.trucks).toEqual(mockTrucks);
  });

  it('should handle getCurrentLocation error', async () => {
    const mockError = new Error('Geolocation error');
    mockGeolocation.getCurrentPosition.mockImplementation((_, error) =>
      error(mockError)
    );

    const { result } = renderHook(() => useFoodTruckFinder());

    await act(async () => {
      const trucks = await result.current.getNearbyTrucks();
      expect(trucks).toEqual([]);
    });

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    expect(result.current.userLocation).toBe(null);
    expect(result.current.locationError).toBe("Unable to get your location. Please check your browser settings and try again.");
    expect(result.current.trucks).toEqual([]);
  });

  it('should update radius and reload trucks', async () => {
    const { result } = renderHook(() => useFoodTruckFinder());
    const newRadius = 2;

    await act(async () => {
      result.current.setRadiusMiles(newRadius);
    });

    // Need to wait for state update before calling getNearbyTrucks
    await act(async () => {
      await result.current.getNearbyTrucks({ latitude: 37.7749, longitude: -122.4194 });
    });

    expect(fetchNearbyTrucks).toHaveBeenCalledWith(37.7749, -122.4194, newRadius);
    expect(result.current.radiusMiles).toBe(newRadius);
  });
});
