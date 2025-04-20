import { Category } from './category.model';

describe('Category Model', () => {
    it(`Given all constructor arguments,
      When a Category is created,
      Then it should set all properties correctly`, () => {
        // Arrange
        const id = '1';
        const title = 'Work';
        const createdAt = new Date('2024-01-01');
        const date = '2024-12-31';

        // Act
        const category = new Category(id, title, createdAt, date);

        // Assert
        expect(category.id).toBe(id);
        expect(category.title).toBe(title);
        expect(category.createdAt).toBe(createdAt);
        expect(category.date).toBe(date);
    });

    it(`Given no createdAt and date,
      When a Category is created,
      Then it should default createdAt to current date and date should be undefined`, () => {
        // Arrange
        const id = '2';
        const title = 'Personal';
        const before = new Date();

        // Act
        const category = new Category(id, title);

        const after = new Date();

        // Assert
        expect(category.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(category.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
        expect(category.date).toBeUndefined();
    });
});
