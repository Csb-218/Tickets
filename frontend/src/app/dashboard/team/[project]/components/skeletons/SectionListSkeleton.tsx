"use client";
import TaskCardSkeleton from "./TaskCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
const sections = [1, 2, 3, 4];

const SectionListSkeleton = () => {
  return (
    <>
      {sections.map((section, index) => (
        <section
          key={section}
          className={`${
            index !== sections.length - 1 ? "border-r border-gray-200" : ""
          } p-3 w-64 flex-shrink-0 bg-gray-50`}
        >
          <div className="mb-2 flex flex-col gap-y-2">
            <div className="flex items-center justify-start gap-x-2">
              <Skeleton className="h-4 w-1/2 rounded" />
            </div>
          </div>
          <div className="space-y-3">
            {

                section % 2 === 0 ?
                <>
                 <TaskCardSkeleton /> 
                 <TaskCardSkeleton/>
                </>
                : 
                <TaskCardSkeleton/>
            }
            
          </div>
        </section>
      ))}
    </>
  );
};

export default SectionListSkeleton;
