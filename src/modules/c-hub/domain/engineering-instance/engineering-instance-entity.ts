export interface EngineeringInstance {
  id: string;
  name: string;
  description: string | null;
  projectId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEngineeringInstanceProps {
  name: string;
  description?: string | null;
  projectId: string;
  userId?: string;
}

export interface UpdateEngineeringInstanceProps {
  name?: string;
  description?: string | null;
}