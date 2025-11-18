import {
  getRandomImage,
  getRandomRating,
  getRandomReviews,
  getRandomColors,
  getRandomIsNew,
} from '../productUtils';

describe('productUtils', () => {
  describe('getRandomImage', () => {
    it('should return a string', () => {
      const result = getRandomImage();
      expect(typeof result).toBe('string');
    });

    it('should return a valid image path', () => {
      const result = getRandomImage();
      expect(result).toMatch(/\.webp$/);
    });
  });

  describe('getRandomRating', () => {
    it('should return a number between 3 and 5', () => {
      for (let i = 0; i < 20; i++) {
        const rating = getRandomRating();
        expect(rating).toBeGreaterThanOrEqual(3);
        expect(rating).toBeLessThanOrEqual(5);
      }
    });

    it('should return a decimal number', () => {
      const result = getRandomRating();
      expect(typeof result).toBe('number');
    });
  });

  describe('getRandomReviews', () => {
    it('should return a positive number', () => {
      for (let i = 0; i < 20; i++) {
        const reviews = getRandomReviews();
        expect(reviews).toBeGreaterThanOrEqual(1);
        expect(reviews).toBeLessThanOrEqual(501);
      }
    });

    it('should return an integer', () => {
      const result = getRandomReviews();
      expect(Number.isInteger(result)).toBe(true);
    });
  });

  describe('getRandomColors', () => {
    it('should return an array of colors', () => {
      const result = getRandomColors();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
    });

    it('should return valid hex colors', () => {
      const result = getRandomColors();
      result.forEach((color) => {
        expect(typeof color).toBe('string');
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });
  });

  describe('getRandomIsNew', () => {
    it('should return a boolean', () => {
      const result = getRandomIsNew();
      expect(typeof result).toBe('boolean');
    });

    it('should return true approximately 30% of the time', () => {
      const iterations = 1000;
      const trueCount = Array.from({ length: iterations }).filter(() =>
        getRandomIsNew()
      ).length;

      const percentage = (trueCount / iterations) * 100;
      // Should be around 30%, allow 10-50% range
      expect(percentage).toBeGreaterThan(10);
      expect(percentage).toBeLessThan(50);
    });
  });
});

