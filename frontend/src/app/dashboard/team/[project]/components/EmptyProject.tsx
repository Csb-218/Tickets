import React from 'react'
import { Button } from '@/components/ui/button'

const EmptyProject = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div className="flex flex-col items-center gap-y-4">
                <h2 className="text-xl font-semibold text-gray-600">This project is empty</h2>
                <p className="text-gray-500">Get started by creating a new section for your tasks.</p>
                <Button variant="outline"> + Create List</Button>
            </div>
        </div>
  )
}

export default EmptyProject