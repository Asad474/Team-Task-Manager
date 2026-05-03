import { FolderKanban, Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
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
import { Textarea } from '../components/ui/textarea';
import { useProjectStore } from '../stores/projectStore';

export default function Projects() {
  const { projects, fetchProjects, createProject, isLoading } = useProjectStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProject(newProject);
    setNewProject({ name: '', description: '' });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage all your projects in one place
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className='cursor-pointer'>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreateProject}>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new project
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter project name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter project description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
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
                  Create Project
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && projects.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <Card className="text-center py-12">
          <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <CardTitle>No projects yet</CardTitle>
          <CardDescription>
            Create your first project to get started
          </CardDescription>
          <Button className="mt-4 cursor-pointer" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link to={`/projects/${project._id}`} key={project._id} className="h-full">
              <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-t-4 border-t-primary/20 hover:border-t-primary flex flex-col">
                <CardHeader className="flex-1">
                  <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                  <CardDescription className="line-clamp-3 mt-2 min-h-[4.5rem]">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${project.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="text-muted-foreground capitalize">{project.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground uppercase tracking-wider">Priority:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        project.priority === 'high' ? 'bg-red-100 text-red-600' : 
                        project.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-green-100 text-green-600'
                      }`}>
                        {project.priority}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}