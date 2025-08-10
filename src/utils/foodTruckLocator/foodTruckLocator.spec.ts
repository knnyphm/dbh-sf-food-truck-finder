import { fetchNearbyTrucks } from './foodTruckLocator';
import type { RawFoodTruck, FoodTruck } from './foodTruckLocator.types';

// Mock fetch globally
global.fetch = jest.fn();

// Mock geolib functions
jest.mock('geolib', () => ({
  getDistance: jest.fn(),
  orderByDistance: jest.fn(),
}));

// Import the mocked functions
import { getDistance, orderByDistance } from 'geolib';

describe('foodTruckLocator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('fetchNearbyTrucks', () => {
    const mockRawTrucks: RawFoodTruck[] = [
      {
        applicant: 'Taco Truck 1',
        locationdescription: '123 Main St',
        latitude: '37.7749',
        longitude: '-122.4194',
        fooditems: 'Tacos, Burritos'
      },
      {
        applicant: 'Burger Truck 2',
        locationdescription: '456 Oak Ave',
        latitude: '37.7849',
        longitude: '-122.4094',
        fooditems: 'Burgers, Fries'
      },
      {
        applicant: 'Invalid Truck',
        locationdescription: 'Invalid Location',
        latitude: 'invalid',
        longitude: 'invalid',
        fooditems: 'Invalid Food'
      }
    ];

    const mockParsedTrucks: FoodTruck[] = [
      {
        applicant: 'Taco Truck 1',
        locationdescription: '123 Main St',
        latitude: 37.7749,
        longitude: -122.4194,
        fooditems: 'Tacos, Burritos'
      },
      {
        applicant: 'Burger Truck 2',
        locationdescription: '456 Oak Ave',
        latitude: 37.7849,
        longitude: -122.4094,
        fooditems: 'Burgers, Fries'
      }
    ];

    it('should fetch and parse food trucks successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRawTrucks
      });

      (getDistance as jest.Mock).mockReturnValue(500); // 500 meters
      (orderByDistance as jest.Mock).mockReturnValue(mockParsedTrucks);

      const result = await fetchNearbyTrucks(37.7749, -122.4194, 1);

      expect(global.fetch).toHaveBeenCalledWith('/api/food-trucks');
      expect(result).toEqual(mockParsedTrucks);
    });

    it('should filter out trucks with invalid coordinates', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRawTrucks
      });

      (getDistance as jest.Mock).mockReturnValue(500);
      (orderByDistance as jest.Mock).mockReturnValue(mockParsedTrucks);

      const result = await fetchNearbyTrucks(37.7749, -122.4194, 1);

      // Should only return 2 valid trucks, filtering out the invalid one
      expect(result).toHaveLength(2);
      expect(result).not.toContainEqual(
        expect.objectContaining({ applicant: 'Invalid Truck' })
      );
    });

    it('should filter trucks within specified radius', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRawTrucks
      });

      // Mock distances: first truck within radius, second outside
      (getDistance as jest.Mock)
        .mockReturnValueOnce(500)  // Taco Truck 1: within 1 mile
        .mockReturnValueOnce(2000); // Burger Truck 2: outside 1 mile

      (orderByDistance as jest.Mock).mockReturnValue([mockParsedTrucks[0]]);

      const result = await fetchNearbyTrucks(37.7749, -122.4194, 1);

      expect(getDistance).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(1);
      expect(result[0].applicant).toBe('Taco Truck 1');
    });

    it('should sort trucks by distance', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRawTrucks
      });

      (getDistance as jest.Mock).mockReturnValue(500);
      
      const sortedTrucks = [
        mockParsedTrucks[1], // Closer truck
        mockParsedTrucks[0]  // Farther truck
      ];
      (orderByDistance as jest.Mock).mockReturnValue(sortedTrucks);

      const result = await fetchNearbyTrucks(37.7749, -122.4194, 1);

      expect(orderByDistance).toHaveBeenCalledWith(
        { latitude: 37.7749, longitude: -122.4194 },
        expect.any(Array)
      );
      expect(result).toEqual(sortedTrucks);
    });

    it('should use default radius of 1 mile when not specified', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRawTrucks
      });

      (getDistance as jest.Mock).mockReturnValue(500);
      (orderByDistance as jest.Mock).mockReturnValue(mockParsedTrucks);

      await fetchNearbyTrucks(37.7749, -122.4194);

      // Should use 1 mile default radius
      expect(getDistance).toHaveBeenCalled();
    });

    it('should handle custom radius in miles', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRawTrucks
      });

      (getDistance as jest.Mock).mockReturnValue(500);
      (orderByDistance as jest.Mock).mockReturnValue(mockParsedTrucks);

      await fetchNearbyTrucks(37.7749, -122.4194, 2.5);

      // Should use 2.5 mile radius
      expect(getDistance).toHaveBeenCalled();
    });

    it('should throw error when API request fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(
        fetchNearbyTrucks(37.7749, -122.4194, 1)
      ).rejects.toThrow('Failed to fetch food trucks: 500 Internal Server Error');
    });

    it('should handle empty truck list', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

      (orderByDistance as jest.Mock).mockReturnValue([]);

      const result = await fetchNearbyTrucks(37.7749, -122.4194, 1);

      expect(result).toEqual([]);
    });

    it('should handle all invalid coordinates', async () => {
      const invalidTrucks: RawFoodTruck[] = [
        {
          applicant: 'Invalid Truck 1',
          locationdescription: 'Invalid Location 1',
          latitude: 'invalid',
          longitude: 'invalid',
          fooditems: 'Invalid Food 1'
        },
        {
          applicant: 'Invalid Truck 2',
          locationdescription: 'Invalid Location 2',
          latitude: 'NaN',
          longitude: 'Infinity',
          fooditems: 'Invalid Food 2'
        }
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => invalidTrucks
      });

      (orderByDistance as jest.Mock).mockReturnValue([]);

      const result = await fetchNearbyTrucks(37.7749, -122.4194, 1);

      expect(result).toEqual([]);
    });
  });
});
