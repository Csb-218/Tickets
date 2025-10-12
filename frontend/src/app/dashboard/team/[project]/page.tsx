"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect} from "react";
import type { VariantProps } from "class-variance-authority";
import type { Task } from "@/types";
import { TableOfContents } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EmptyProject   from "./components/EmptyProject"
import SectionList from "./components/SectionList";
import SectionListSkeleton from "./components/skeletons/SectionListSkeleton";
import { server } from "@/config/Axios";
import type { ProjectDetails } from "@/types";

type BadgeVariant = VariantProps<typeof Badge>["variant"];

type Section = {
  title: string;
  variant?: BadgeVariant;
  badgeText?: string;
  badgeClassName?: string;
  tasks: Task[];
};

const Project = () => {
  const list_tag_bg_1 = "bg-[#FDDBF6] text-[#702C61]";
//   const list_tag_bg_2 = "bg-[#E9DFFF] text-[#483473]";
//   const list_tag_bg_3 = "bg-[#CCF9FF] text-[#0E6874]";
//   const list_tag_bg_4 = "bg-[#D0F8E9] text-[#166747]";
//   const list_tag_bg_5 = "bg-[#ebebeb] text-[#999999]";

  const [isLoading, setLoading] = useState<boolean>(true);
  const [lists, setLists] = useState<Section[]>([
    // {
    //     title: "Todo",
    //     variant: "secondary",
    //     badgeText: "Todo",
    //     badgeClassName: list_tag_bg_1,
    //     tasks: [
    //     ],
    // },
    // {
    //     title: "In Progress",
    //     variant: "secondary",
    //     badgeText: "In Progress",
    //     badgeClassName: list_tag_bg_2,
    //     tasks: [
    //     ],
    // },
    // {
    //     title: "Todo",
    //     variant: "secondary",
    //     badgeText: "Todo",
    //     badgeClassName: list_tag_bg_1,
    //     tasks: [
    //     ],
    // },
    // {
    //     title: "In Progress",
    //     variant: "secondary",
    //     badgeText: "In Progress",
    //     badgeClassName: list_tag_bg_2,
    //     tasks: [
    //     ],
    // }
  ]);

  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);

        const id = searchParams.get("id");

        const res = await server({
          url: `/api/project/${id}`,
        });

        const project: ProjectDetails = res.data;
        console.log(project);

        const newlists = project.lists.map((list) => {
          return {
            title: list.name,
            badgeText: list.name,
            variant: "secondary" as BadgeVariant,
            badgeClassName: list_tag_bg_1,
            tasks: list.tasks,
          };
        });
        setLists(() => [...newlists]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, []);


  return (
    <div className="w-full mx-auto border-[1px] rounded-sm bg-gray-50 min-h-screen flex flex-col">
      <header className="flex-shrink-0 flex gap-x-1 items-center py-1 px-4 bg-white border-b-[1px]">
        <TableOfContents size={16} />
        <h1 className="text-lg text-gray-700"> All </h1>
      </header>

      <main className="flex flex-row overflow-x-auto h-full">
          {/* <SectionListSkeleton /> */}
        {isLoading ? (
          <SectionListSkeleton />
        ) : lists.length > 0 ? (
          <>
            {lists.map((section, index) => 
            <SectionList key={index} section={section} index={index} lists={lists} />
            )}
            {
              <section className="p-3 w-64 text-center flex-shrink-0 bg-gray-50 border-l border-gray-200">
                <Button variant="ghost"> + Create List</Button>
              </section>
            }
          </>
        ) : (
          <EmptyProject/>
        )}
      </main>
    </div>
  );
};

export default Project;
