import { useState } from 'react'
import { useSidebar } from "@/providers/sidebar-store-provider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Spinner } from "@/components/ui/spinner"


export default function AddProjectDialog(){

  const [open, setOpen] = useState<boolean>(false);
  const [isCreating,SetCreating] = useState<boolean>(false)
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');

  const {addProject,navMain} = useSidebar(state=>state)
  

  const handleCreateProject = async() => {
    try{
        console.log('Creating project:', { name: projectName, description: projectDescription });
        SetCreating(true)
        await new Promise(resolve => setTimeout(resolve, 3000));
        addProject({title:projectName , description:projectDescription})
    }catch(error){

    }finally{
        setProjectName('');
        setProjectDescription('');
        SetCreating(false)
        setOpen(false);

    }
   
  };

  return(
    <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size={"sm"} className="font-light"> + New Project</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Enter the name and description for your new project. Click create when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="col-span-3" placeholder="Project name" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea id="description" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} className="col-span-3" placeholder="Project description" />
                </div>
              </div>
              <DialogFooter>
                <Button disabled={isCreating} type="submit" onClick={handleCreateProject}>
                    {isCreating && <Spinner/>}
                  Create Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
  )
}