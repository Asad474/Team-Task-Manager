import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Circle,
  ClipboardList,
  Clock,
  Clock as ClockIcon,
  Edit,
  Flag,
  Info,
  Loader2,
  MoreVertical,
  Plus,
  Trash2,
  UserCircle,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import { useProjectStore, useTaskStore, useUserStore } from '../stores';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const {
    currentProject,
    fetchProjectById,
    updateProject,
    deleteProject,
    addMember,
    isLoading: projectLoading,
  } = useProjectStore();
  const { tasks, fetchTasks, createTask, updateTaskStatus, deleteTask, isLoading: tasksLoading } = useTaskStore();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [error, setError] = useState('');

  const [editForm, setEditForm] = useState<{
    name: string;
    description: string;
    status: 'active' | 'archived' | 'completed';
    priority: 'low' | 'medium' | 'high';
  }>({
    name: '',
    description: '',
    status: 'active',
    priority: 'medium',
  });

  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate: string;
    assignedTo: string;
  }>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
  });

  useEffect(() => {
    if (id) {
      fetchProjectById(id);
      fetchTasks(id);
    }
  }, [id]);

  useEffect(() => {
    if (currentProject) {
      setEditForm({
        name: currentProject.name,
        description: currentProject.description,
        status: currentProject.status,
        priority: currentProject.priority,
      });
    }
  }, [currentProject]);

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await updateProject(id, editForm);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteProject = async () => {
    if (id) {
      await deleteProject(id);
      navigate('/projects');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await createTask({
        ...newTask,
        projectId: id,
      });
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignedTo: '',
      });
      setIsTaskDialogOpen(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (id && newMemberEmail) {
      try {
        await addMember(id, newMemberEmail);
        setNewMemberEmail('');
        setIsMemberDialogOpen(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to add member');
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'review':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'archived':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (projectLoading || !currentProject) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isAdmin = user?.role === 'admin' || currentProject.owner === user?._id;
  const projectTasks = tasks.filter((task) => task.projectId === id);
  const completedTasks = projectTasks.filter((t) => t.status === 'done').length;
  const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;

  const todoTasks = projectTasks.filter(t => t.status === 'todo').length;
  const inProgressTasks = projectTasks.filter(t => t.status === 'in_progress').length;
  const reviewTasks = projectTasks.filter(t => t.status === 'review').length;
  const overdueTasks = projectTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'done').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{currentProject.name}</h1>
            <p className="text-muted-foreground mt-1">{currentProject.description}</p>
          </div>
        </div>

        {isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(currentProject.status)}>
              {currentProject.status}
            </Badge>
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flag className="h-4 w-4 text-purple-600" />
              Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={getPriorityColor(currentProject.priority)}>
              {currentProject.priority}
            </Badge>
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-green-600" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{Math.round(progress)}%</div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-600" />
              Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentProject.members?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Styled Tabs */}
      <Tabs defaultValue="tasks" className="space-y-6 flex flex-col">
        <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-lg">
          <TabsTrigger
            value="tasks"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 cursor-pointer"
          >
            <ClipboardList className="h-4 w-4" />
            Tasks
            {projectTasks.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {projectTasks.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 cursor-pointer"
          >
            <Users className="h-4 w-4" />
            Team Members
            {currentProject.members?.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {currentProject.members.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="overview"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 cursor-pointer"
          >
            <Info className="h-4 w-4" />
            Overview
          </TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Project Tasks</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and track all tasks for this project
              </p>
            </div>
            <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleCreateTask}>
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                      Add a new task to this project
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
                      <Label htmlFor="assignedTo">Assign To</Label>
                      <Select
                        value={newTask.assignedTo}
                        onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select team member" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Add Owner as option if populated */}
                          {currentProject?.owner && typeof currentProject.owner === 'object' && (
                            <SelectItem value={(currentProject.owner as any)._id}>
                              {(currentProject.owner as any).name} (Owner)
                            </SelectItem>
                          )}
                          {/* Add Members */}
                          {currentProject?.members?.map((member: any) => (
                            <SelectItem key={member._id} value={member._id}>
                              {member.name}
                            </SelectItem>
                          ))}
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
                    <Button type="button" variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Task</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {tasksLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : projectTasks.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No tasks yet. Create your first task!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {projectTasks.map((task) => (
                <Card key={task._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
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
                            {(user?.role === 'admin' || currentProject.owner === user?._id) && (
                              <DropdownMenuItem onClick={() => updateTaskStatus(task._id, 'done')}>
                                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                Done
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`font-semibold ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-primary">
                                  {task.assignedTo?.name?.charAt(0) || '?'}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {task.assignedTo?.name || 'Unassigned'}
                              </span>
                            </div>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Flag className="h-3 w-3" />
                              {task.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTask(task._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Team Members</h2>
              <p className="text-sm text-muted-foreground mt-1">
                People working on this project
              </p>
            </div>
            {isAdmin && (
              <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleAddMember}>
                    <DialogHeader>
                      <DialogTitle>Add Team Member</DialogTitle>
                      <DialogDescription>
                        Add a member to this project by email
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="email">User Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter user's email"
                          value={newMemberEmail}
                          onChange={(e) => setNewMemberEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsMemberDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Member</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {currentProject.members?.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No team members yet. Add your first member!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {currentProject.members?.map((member: any) => (
                <Card key={member._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        {member._id === currentProject.owner && (
                          <Badge variant="secondary" className="mt-1 text-xs">Project Owner</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Overview Tab - Attractive Layout with Proper Background */}
        <TabsContent value="overview" className="space-y-6 mt-4">
          {/* Main Project Info Card */}
          <Card className="bg-card border shadow-sm">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Project Information
              </CardTitle>
              <CardDescription>
                Detailed information about this project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <ClipboardList className="h-4 w-4" />
                    Description
                  </div>
                  <p className="text-foreground leading-relaxed bg-muted/20 p-3 rounded-lg">
                    {currentProject.description}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Status</span>
                    </div>
                    <Badge className={getStatusColor(currentProject.status)}>
                      {currentProject.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Priority</span>
                    </div>
                    <Badge className={getPriorityColor(currentProject.priority)}>
                      {currentProject.priority}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm font-medium">
                      {new Date(currentProject.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <ClockIcon className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Last Updated</p>
                    <p className="text-sm font-medium">
                      {new Date(currentProject.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <UserCircle className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Project ID</p>
                    <p className="text-sm font-mono">{currentProject._id}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Summary Card */}
          <Card className="bg-card border shadow-sm">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Task Summary
              </CardTitle>
              <CardDescription>
                Overview of all tasks in this project
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="text-center p-4 rounded-lg bg-white border shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{projectTasks.length}</div>
                  <div className="text-sm text-muted-foreground">Total Tasks</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white border shadow-sm">
                  <div className="text-2xl font-bold text-gray-600">{todoTasks}</div>
                  <div className="text-sm text-muted-foreground">To Do</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white border shadow-sm">
                  <div className="text-2xl font-bold text-yellow-600">{inProgressTasks}</div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white border shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">{reviewTasks}</div>
                  <div className="text-sm text-muted-foreground">Review</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white border shadow-sm">
                  <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>

              {overdueTasks > 0 && (
                <div className="mt-4 p-3 bg-white border rounded-lg flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-600">Overdue Tasks</span>
                  </div>
                  <Badge variant="destructive">{overdueTasks} tasks overdue</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <form onSubmit={handleUpdateProject}>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Update your project details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Project Name</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(value) => setEditForm({ ...editForm, status: value as 'active' | 'archived' | 'completed' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select
                    value={editForm.priority}
                    onValueChange={(value) => setEditForm({ ...editForm, priority: value as 'low' | 'medium' | 'high' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Project Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
              All tasks associated with this project will also be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteProject}>
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}