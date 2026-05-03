import mongoose, { Document, Schema } from 'mongoose';

export enum ProjectStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  COMPLETED = 'completed',
}

export const projectStatuses = Object.values(ProjectStatus);

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export const projectPriorities = Object.values(ProjectPriority);

export interface IProject extends Document {
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [3, 'Project name must be at least 3 characters'],
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    }],
    status: {
      type: String,
      enum: projectStatuses,
      default: ProjectStatus.ACTIVE,
    },
    priority: {
      type: String,
      enum: projectPriorities,
      default: ProjectPriority.MEDIUM,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure owner is automatically added to members
projectSchema.pre('save', async function (this: IProject) {
  if (this.isNew && this.owner) {
    const ownerId = this.owner.toString();
    const isMember = this.members.some((memberId) => memberId.toString() === ownerId);
    
    if (!isMember) {
      this.members.push(this.owner);
    }
  }
});

export const Project = mongoose.model<IProject>('Project', projectSchema);