"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <aside
      className={`fixed top-12 left-0 z-40 h-[calc(100vh-3rem)] w-72 bg-elevated border-r border-surface-border flex flex-col transition-transform duration-200 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-4 h-12 border-b border-surface-border shrink-0">
        <h2 className="text-copy-primary text-sm font-semibold">Projects</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          className="text-copy-muted hover:text-copy-primary"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Tabs defaultValue="my-projects" className="flex-1 min-h-0 pt-3">
          <TabsList className="mx-4 w-[calc(100%-2rem)]">
            <TabsTrigger value="my-projects" className="flex-1">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex-1">
              Shared
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="my-projects"
            className="flex flex-1 items-center justify-center"
          >
            <p className="text-copy-faint text-sm">No projects yet</p>
          </TabsContent>
          <TabsContent
            value="shared"
            className="flex flex-1 items-center justify-center"
          >
            <p className="text-copy-faint text-sm">No shared projects</p>
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-4 border-t border-surface-border shrink-0">
        <Button className="w-full gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </aside>
  );
}
