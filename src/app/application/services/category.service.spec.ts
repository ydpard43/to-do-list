import { CategoryRepository } from '../ports/category.repository';
import { Category } from 'src/app/domain/models/category.model';
import { CategoriesService } from './category.service';

describe('CategoriesService', () => {
    let service: CategoriesService;
    let mockRepository: jasmine.SpyObj<CategoryRepository>;

    beforeEach(() => {
        mockRepository = jasmine.createSpyObj<CategoryRepository>('CategoryRepository', [
            'save',
            'delete',
            'findById',
            'findAll',
        ]);

        service = new CategoriesService(mockRepository);
    });

    it(`Given a title and optional date,
      When addCategory is called,
      Then it should save the category with correct values`, () => {
        // Arrange
        const title = 'Work';
        const date = '2025-04-20';

        // Act
        const category = service.addCategory(title, date);

        // Assert
        expect(category.title).toBe(title);
        expect(category.date).toBe(date);
        expect(category.createdAt instanceof Date).toBeTrue();
        expect(mockRepository.save).toHaveBeenCalledWith(category);
    });

    it(`Given a category ID,
      When deleteCategory is called,
      Then it should call the repository to delete that category`, () => {
        // Arrange
        const categoryId = '123';

        // Act
        service.deleteCategory(categoryId);

        // Assert
        expect(mockRepository.delete).toHaveBeenCalledWith(categoryId);
    });

    it(`Given an existing category ID and updated data,
      When updateCategory is called,
      Then it should update and save the category`, () => {
        // Arrange
        const category = new Category('1', 'Old Title', new Date(), '2025-01-01');
        mockRepository.findById.and.returnValue(category);
        const updatedData = { title: 'Updated Title' };

        // Act
        const result = service.updateCategory('1', updatedData);

        // Assert
        expect(result?.title).toBe('Updated Title');
        expect(mockRepository.save).toHaveBeenCalledWith(category);
    });

    it(`Given a non-existent category ID,
      When updateCategory is called,
      Then it should return undefined and not call save`, () => {
        // Arrange
        mockRepository.findById.and.returnValue(undefined);

        // Act
        const result = service.updateCategory('999', { title: 'Does Not Exist' });

        // Assert
        expect(result).toBeUndefined();
        expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it(`Given multiple categories with different createdAt dates,
      When getCategories is called,
      Then it should return them sorted and paginated`, () => {
        // Arrange
        const cat1 = new Category('1', 'Cat 1', new Date('2023-01-01'), '');
        const cat2 = new Category('2', 'Cat 2', new Date('2025-01-01'), '');
        const cat3 = new Category('3', 'Cat 3', new Date('2024-01-01'), '');
        mockRepository.findAll.and.returnValue([cat1, cat2, cat3]);

        // Act
        const result = service.getCategories(0, 2);

        // Assert
        expect(result.length).toBe(2);
        expect(result[0].id).toBe('2');
        expect(result[1].id).toBe('3');
    });

    it(`Given the generateId method,
      When it is called,
      Then it should return a valid UUID string`, () => {
        // Act
        const uuid = (service as any).generateId();

        // Assert
        expect(typeof uuid).toBe('string');
        expect(uuid.length).toBeGreaterThan(0);
    });
});
