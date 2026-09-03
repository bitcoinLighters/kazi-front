import { useCallback, useEffect, useState } from 'react';
import { paymentService } from '../services/paymentService';
import { taskService } from '../services/taskService';
import { submissionService } from '../services/submissionService';
import { useAuth } from '../context/AuthContext';
import type { CreateTaskData, Payment, Task } from '../types/api';

export function useTasks() {
  const { role } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const loadTasks = useCallback(async () => {
    setLoading(true); setError('');
    try {
      if (role === 'youth') {
        const available = await taskService.getTasks('youth');
        let assigned: Task[] = [];
        try { assigned = await taskService.getMyTasks(); } catch { /* Older backend versions may not expose the assigned-task route yet. */ }
        const combined = [...assigned, ...available];
        setTasks(combined.filter((task, index) => combined.findIndex((item) => String(item.id) === String(task.id)) === index));
      } else {
        setTasks(await taskService.getTasks(role || 'youth'));
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load tasks.'); } finally { setLoading(false); }
  }, [role]);
  useEffect(() => { void loadTasks(); }, [loadTasks]);

  async function createTask(data: CreateTaskData) { const task = await taskService.createTask(data); setTasks((current) => [task, ...current]); return task; }
  async function acceptTask(taskId: string | number) { const task = await taskService.acceptTask(taskId); setTasks((current) => current.some((item) => String(item.id) === String(taskId)) ? current.map((item) => String(item.id) === String(taskId) ? task : item) : [task, ...current]); return task; }
  async function approveAndPay(taskId: string | number): Promise<Payment> {
    setActionError('');
    try {
      const submissions = await submissionService.getSubmissions() as Array<{ _id?: string; id?: string; taskId?: string | { _id?: string } }>;
      const submission = submissions.find((item) => String(typeof item.taskId === 'object' ? item.taskId?._id : item.taskId) === String(taskId));
      if (!submission) throw new Error('No submission is available for this task.');
      const payment = await paymentService.approveAndPay(submission._id || submission.id || '');
      setTasks((current) => current.map((task) => task.id === taskId ? { ...task, status: 'paid' } : task)); return payment;
    }
    catch (cause) { const message = cause instanceof Error ? cause.message : 'Payment could not be completed.'; setActionError(message); throw cause; }
  }
  return { tasks, loading, error, actionError, reload: loadTasks, createTask, acceptTask, approveAndPay };
}
