import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from "lucide-react"

const AddTaskForm = ({setTaskForm}:{setTaskForm:React.Dispatch<React.SetStateAction<number|null>>}) => {
    const [title, setTitle] = useState('');
    const [subtasks, setSubtasks] = useState<string[]>([]);
    const [currentSubtask, setCurrentSubtask] = useState('');

    const handleAddSubtask = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentSubtask.trim()) {
            setSubtasks([...subtasks, currentSubtask.trim()]);
            setCurrentSubtask('');
        }
    };

    const handleRemoveSubtask = (indexToRemove: number) => {
        setSubtasks(subtasks.filter((_, index) => index !== indexToRemove));
    };

    const handleSaveTask = () => {
        if (!title.trim()) {
            alert('Task title is required.');
            return;
        }

        const newTask = {
            title: title.trim(),
            subtasks: subtasks.map((content, index) => ({
                id: Date.now() + index, // Using timestamp for unique ID for now
                content,
            })),
        };

        console.log('New Task:', newTask);
        // Here you would typically call a function to save the task to your backend or state management store.
        // e.g., addTask(newTask);

        // Reset form
        setTitle('');
        setSubtasks([]);
        setCurrentSubtask('');
    };

    return (
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm space-y-2">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title..."
                className="w-full text-sm p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            {/* Subtasks list */}
            <ul className="space-y-1 pl-4">
                {subtasks.map((subtask, index) => (
                    <li key={index} className="flex items-center justify-between text-sm text-gray-600">
                        <span>• {subtask}</span>
                        <Button type="button" variant={"ghost"} onClick={() => handleRemoveSubtask(index)} className="text-red-500 hover:text-red-700 hover:bg-transparent cursor-pointer text-xs font-bold">
                            ✕
                        </Button>
                    </li>
                ))}
            </ul>

            {/* Add subtask form */}
            <form onSubmit={handleAddSubtask} className="flex items-center space-x-2">
                <input
                    type="text"
                    value={currentSubtask}
                    onChange={(e) => setCurrentSubtask(e.target.value)}
                    placeholder="Add a subtask..."
                    className="flex-grow text-sm p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <Button type="submit" variant="outline" className="">
                    Add
                </Button>
            </form>

            <div className="flex items-center justify-between gap-x-1">
                <Button onClick={handleSaveTask} variant="secondary" size={"sm"} className="flex-1 bg-blue-500 text-white font-bold hover:bg-blue-600 ">
                    Save Task
                </Button>
                <Button onClick={()=>setTaskForm(null)} variant="outline" size={"icon-sm"}>
                    <X size={24} />
                </Button>
            </div>


        </div>
    );
};

export default AddTaskForm;