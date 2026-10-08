import {
  allBooks,
  bestsellers,
  categories,
  newLaunches,
  recommendedBooks,
  sampleReviews,
} from "./books";

describe("books data module", () => {
  describe("categories", () => {
    test("is an array containing primary categories", () => {
      expect(Array.isArray(categories)).toBe(true);
      expect(categories).toContain("All");
      expect(categories).toContain("Romance");
      expect(categories).toContain("Mystery");
      expect(categories).toContain("Science Fiction");
      expect(categories.length).toBeGreaterThan(5);
    });
  });

  describe("allBooks", () => {
    test("contains valid book objects with required fields", () => {
      expect(Array.isArray(allBooks)).toBe(true);
      expect(allBooks.length).toBeGreaterThan(0);

      allBooks.forEach((book) => {
        expect(book).toHaveProperty("id");
        expect(typeof book.id).toBe("number");
        expect(book).toHaveProperty("title");
        expect(typeof book.title).toBe("string");
        expect(book).toHaveProperty("author");
        expect(typeof book.author).toBe("string");
        expect(book).toHaveProperty("description");
        expect(book).toHaveProperty("longDescription");
        expect(book).toHaveProperty("publisher");
        expect(book).toHaveProperty("format");
        expect(book).toHaveProperty("language");
        expect(book).toHaveProperty("rating");
        expect(typeof book.rating).toBe("number");
        expect(book.rating).toBeGreaterThanOrEqual(1);
        expect(book.rating).toBeLessThanOrEqual(5);
        expect(book).toHaveProperty("sells");
        expect(book).toHaveProperty("tags");
        expect(Array.isArray(book.tags)).toBe(true);
        expect(book).toHaveProperty("price");
        expect(typeof book.price).toBe("number");
        expect(book.price).toBeGreaterThan(0);
        expect(book).toHaveProperty("delivery");
        expect(book).toHaveProperty("cover");
        expect(book).toHaveProperty("coverText");
        expect(book).toHaveProperty("coverSub");
        expect(book).toHaveProperty("authorBio");
        expect(book).toHaveProperty("section");
        expect(["recommended", "bestseller", "new"]).toContain(book.section);
      });
    });

    test("contains unique book IDs", () => {
      const ids = allBooks.map((b) => b.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe("filtered book exports", () => {
    test("recommendedBooks contains only books with section 'recommended'", () => {
      expect(recommendedBooks.length).toBeGreaterThan(0);
      recommendedBooks.forEach((book) => {
        expect(book.section).toBe("recommended");
      });
    });

    test("bestsellers contains only books with section 'bestseller'", () => {
      expect(bestsellers.length).toBeGreaterThan(0);
      bestsellers.forEach((book) => {
        expect(book.section).toBe("bestseller");
      });
    });

    test("newLaunches contains only books with section 'new'", () => {
      expect(newLaunches.length).toBeGreaterThan(0);
      newLaunches.forEach((book) => {
        expect(book.section).toBe("new");
      });
    });

    test("the sum of sections matches allBooks length", () => {
      expect(
        recommendedBooks.length + bestsellers.length + newLaunches.length
      ).toBe(allBooks.length);
    });
  });

  describe("sampleReviews", () => {
    test("contains valid review items", () => {
      expect(Array.isArray(sampleReviews)).toBe(true);
      expect(sampleReviews.length).toBeGreaterThan(0);
      sampleReviews.forEach((review) => {
        expect(review).toHaveProperty("id");
        expect(review).toHaveProperty("name");
        expect(review).toHaveProperty("rating");
        expect(review).toHaveProperty("text");
        expect(typeof review.rating).toBe("number");
      });
    });
  });
});
