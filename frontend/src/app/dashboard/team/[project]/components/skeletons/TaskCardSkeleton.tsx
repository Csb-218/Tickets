import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const list = [1, 2, 3, 4];

const TaskCardSkeleton = () => {
  return (
    
     
        <div className="p-4 bg-white space-y-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <Skeleton className="h-5 w-1/2 rounded" />
          {list.map((item) => (
            <div className="flex gap-x-1" key={item}>
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-full rounded" />
            </div>
          ))}
        </div>


    // <div className="flex flex-col space-y-3">
    //   <Skeleton className="h-[125px] w-[250px] rounded-xl" />
    //   <div className="space-y-2">
    //     <Skeleton className="h-4 w-[250px]" />
    //     <Skeleton className="h-4 w-[200px]" />
    //   </div>
    // </div>
   
  );
};

export default TaskCardSkeleton;
