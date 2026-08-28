export type UserRole = 'youth' | 'client';

export type User = {
  id?: string | number;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthResponse = { token: string; user: User };
export type TaskStatus = 'open' | 'in_progress' | 'reviewing' | 'paid';

export type Task = {
  id: string | number;
  title: string;
  category: string;
  description?: string;
  rewardSats: number;
  deadline?: string;
  status: TaskStatus;
  submittedBy?: string;
};

export type CreateTaskData = { title: string; category: string; description?: string; rewardSats: number; deadline?: string };
export type SubmitWorkData = { description: string; fileUrl?: string; invoice: string };
export type Wallet = { balanceSats: number; currency?: string };
export type Earning = { id: string | number; amountSats: number; description?: string; createdAt?: string };
export type Payment = { id: string | number; amount: number; recipient?: string; fee?: number; status: string };