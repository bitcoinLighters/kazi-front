import { useCallback, useEffect, useState } from 'react';
import { paymentService } from '../services/paymentService';
import { taskService } from '../services/taskService';
import type { CreateTaskData, Payment, Task } from '../types/api';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const loadTasks = useCallback(async () => {
    setLoading(true); setError('');
    try { setTasks(await taskService.getTasks()); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load tasks.'); } finally { setLoading(false); }
  }, []);
  useEffect(() => { void loadTasks(); }, [loadTasks]);

  async function createTask(data: CreateTaskData) { const task = await taskService.createTask(data); setTasks((current) => [task, ...current]); return task; }
  async function approveAndPay(taskId: string | number): Promise<Payment> {
    setActionError('');
    try { const payment = await paymentService.approveAndPay(taskId); setTasks((current) => current.map((task) => task.id === taskId ? { ...task, status: 'paid' } : task)); return payment; }
    catch (cause) { const message = cause instanceof Error ? cause.message : 'Payment could not be completed.'; setActionError(message); throw cause; }
  }
  return { tasks, loading, error, actionError, reload: loadTasks, createTask, approveAndPay };
}