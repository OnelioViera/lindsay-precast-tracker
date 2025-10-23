import { ProjectService } from '@/services/projectService';

// Mock the database connection and models
jest.mock('@/lib/db');
jest.mock('@/models/Project');
jest.mock('@/models/Customer');

describe('ProjectService', () => {
  describe('generateProjectNumber', () => {
    it('should generate first project number for year', async () => {
      const Project = require('@/models/Project');
      Project.findOne.mockResolvedValue(null);

      const number = await ProjectService.generateProjectNumber();
      expect(number).toMatch(/^PRJ-2025-001$/);
    });

    it('should increment sequence for existing projects', async () => {
      const Project = require('@/models/Project');
      Project.findOne.mockResolvedValue({
        projectNumber: 'PRJ-2025-001'
      });

      const number = await ProjectService.generateProjectNumber();
      expect(number).toBe('PRJ-2025-002');
    });
  });

  describe('createProject', () => {
    it('should create a new project successfully', async () => {
      const Project = require('@/models/Project');
      const Customer = require('@/models/Customer');
      
      const mockCustomer = {
        _id: 'customer123',
        name: 'Test Customer',
        projectHistory: {
          totalProjects: 0,
          activeProjects: 0,
          recentProjectIds: []
        },
        save: jest.fn()
      };

      const mockProject = {
        _id: 'project123',
        projectNumber: 'PRJ-2025-001',
        customerName: 'Test Customer',
        createdBy: 'user123'
      };

      Customer.findById.mockResolvedValue(mockCustomer);
      Project.create.mockResolvedValue(mockProject);

      const projectData = {
        customerId: 'customer123',
        productType: 'storm' as const,
        specifications: {
          length: 8,
          width: 10,
          height: 12
        }
      };

      const result = await ProjectService.createProject(projectData, 'user123');

      expect(result).toEqual(mockProject);
      expect(Customer.findById).toHaveBeenCalledWith('customer123');
      expect(Project.create).toHaveBeenCalled();
      expect(mockCustomer.save).toHaveBeenCalled();
    });

    it('should throw error if customer not found', async () => {
      const Customer = require('@/models/Customer');
      Customer.findById.mockResolvedValue(null);

      const projectData = {
        customerId: 'nonexistent',
        productType: 'storm' as const,
        specifications: {
          length: 8,
          width: 10,
          height: 12
        }
      };

      await expect(
        ProjectService.createProject(projectData, 'user123')
      ).rejects.toThrow('Customer not found');
    });
  });
});
