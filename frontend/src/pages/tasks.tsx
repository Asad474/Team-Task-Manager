import { AlertCircle, CheckCircle2, Circle, Clock, Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Textarea } from '../components/ui/textarea';
import { useProjectStore, useTaskStore, useUserStore } from '../stores';

export default function Tasks() {
  const { tasks, fetchTasks, createTask, updateTaskStatus, isLoading } = useTaskStore();
  const { projects, fetchProjects } = useProjectStore();
  const { user } = useUserStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    projectId: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate: string;
    assignedTo: string;
  }>({
    title: '',
    description: '',
    projectId: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
  });

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTask(newTask);
    setNewTask({
      title: '',
      description: '',
      projectId: '',
      priority: 'medium',
      dueDate: '',
      assignedTo: '',
    });
    setIsDialogOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'review':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-green-600 bg-green-50';
    }
  };

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    review: tasks.filter(t => t.status === 'review'),
    done: tasks.filter(t => t.status === 'done'),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track all your tasks
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <form onSubmit={handleCreateTask}>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new task
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter task description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="project">Project</Label>
                  <Select
                    value={newTask.projectId}
                    onValueChange={(value) => setNewTask({ ...newTask, projectId: value, assignedTo: '' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project._id} value={project._id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assign To</Label>
                  <Select
                    value={newTask.assignedTo}
                    onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                    disabled={!newTask.projectId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={newTask.projectId ? "Select team member" : "Select a project first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {newTask.projectId && (
                        <>
                          {/* Add Owner */}
                          {projects.find(p => p._id === newTask.projectId)?.owner && (
                            <SelectItem value={(projects.find(p => p._id === newTask.projectId)?.owner as any)._id}>
                              {(projects.find(p => p._id === newTask.projectId)?.owner as any).name} (Owner)
                            </SelectItem>
                          )}
                          {/* Add Members */}
                          {projects.find(p => p._id === newTask.projectId)?.members?.map((member: any) => (
                            <SelectItem key={member._id} value={member._id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value as 'low' | 'medium' | 'high' | 'urgent' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="cursor-pointer">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Task
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && tasks.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <Card key={status}>
              <CardHeader>
                <CardTitle className="capitalize">{status}</CardTitle>
                <CardDescription>{statusTasks.length} tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {statusTasks.map((task) => (
                  <div key={task._id} className="p-3 border rounded-lg space-y-2 hover:shadow-sm transition-shadow">
                    <div className="flex items-start gap-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="mt-1 hover:scale-110 transition-transform cursor-pointer outline-none">
                            {getStatusIcon(task.status)}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => updateTaskStatus(task._id, 'todo')}>
                            <Circle className="mr-2 h-4 w-4 text-gray-400" />
                            To Do
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateTaskStatus(task._id, 'in_progress')}>
                            <Clock className="mr-2 h-4 w-4 text-blue-500" />
                            In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateTaskStatus(task._id, 'review')}>
                            <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                            Review
                          </DropdownMenuItem>
                          {(user?.role === 'admin' || task.assignedBy?._id === user?._id) && (
                            <DropdownMenuItem onClick={() => updateTaskStatus(task._id, 'done')}>
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                              Done
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-primary">
                              {task.assignedTo?.name?.charAt(0) || '?'}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {task.assignedTo?.name || 'Unassigned'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {task.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>

                  </div>
                ))}
                {statusTasks.length === 0 && (
                  <p className="text-center text-muted-foreground text-sm py-4">
                    No tasks
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}