import connectDB from '@/lib/db';
import Project from '@/models/Project';
import Customer from '@/models/Customer';
import { ProjectInput, ProjectUpdateInput } from '@/lib/validations';

export class ProjectService {
  static async generateProjectNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const lastProject = await Project.findOne({
      projectNumber: new RegExp(`^PRJ-${year}-`)
    }).sort({ projectNumber: -1 });
    
    let sequence = 1;
    if (lastProject) {
      const lastSequence = parseInt(
        lastProject.projectNumber.split('-')[2]
      );
      sequence = lastSequence + 1;
    }
    
    return `PRJ-${year}-${sequence.toString().padStart(3, '0')}`;
  }

  static async createProject(data: ProjectInput, userId: string) {
    await connectDB();

    // Get customer info
    const customer = await Customer.findById(data.customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    // Generate project number
    const projectNumber = await this.generateProjectNumber();

    // Create project
    const project = await Project.create({
      ...data,
      projectNumber,
      customerName: customer.name,
      createdBy: userId,
    });

    // Update customer project history
    customer.projectHistory.totalProjects += 1;
    customer.projectHistory.activeProjects += 1;
    customer.projectHistory.recentProjectIds.unshift(project._id);
    if (customer.projectHistory.recentProjectIds.length > 5) {
      customer.projectHistory.recentProjectIds = customer.projectHistory.recentProjectIds.slice(0, 5);
    }
    await customer.save();

    return project;
  }

  static async updateProject(projectId: string, data: ProjectUpdateInput) {
    await connectDB();

    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Update project
    Object.assign(project, data);
    await project.save();

    return project;
  }

  static async deleteProject(projectId: string) {
    await connectDB();

    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    await Project.findByIdAndDelete(projectId);

    // Update customer project history
    const customer = await Customer.findById(project.customerId);
    if (customer) {
      customer.projectHistory.totalProjects -= 1;
      if (project.status !== 'production') {
        customer.projectHistory.activeProjects -= 1;
      }
      await customer.save();
    }

    return true;
  }

  static async getProjects(filters: any = {}) {
    await connectDB();

    const query: any = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.type) {
      query.productType = filters.type;
    }
    
    if (filters.customerId) {
      query.customerId = filters.customerId;
    }
    
    if (filters.search) {
      query.$or = [
        { projectNumber: new RegExp(filters.search, 'i') },
        { customerName: new RegExp(filters.search, 'i') },
      ];
    }

    const skip = ((filters.page || 1) - 1) * (filters.limit || 20);
    const sort: any = {};
    sort[filters.sortBy || 'createdAt'] = filters.sortOrder === 'asc' ? 1 : -1;

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate('customerId', 'name contactInfo.email')
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(filters.limit || 20)
        .lean(),
      Project.countDocuments(query)
    ]);

    return {
      projects,
      pagination: {
        total,
        page: filters.page || 1,
        limit: filters.limit || 20,
        pages: Math.ceil(total / (filters.limit || 20))
      }
    };
  }

  static async getProjectById(projectId: string) {
    await connectDB();

    const project = await Project.findById(projectId)
      .populate('customerId', 'name contactInfo')
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('drawings.uploadedBy', 'name email')
      .populate('timeTracking.entries.userId', 'name email')
      .populate('revisions.completedBy', 'name email')
      .populate('productionHandoff.rfis.askedBy', 'name email')
      .populate('productionHandoff.rfis.answeredBy', 'name email')
      .lean();

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  }
}
