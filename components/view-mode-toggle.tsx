"use client"

import { Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ViewModeToggleProps {
  viewMode: "list" | "gallery"
  onChange: (mode: "list" | "gallery") => void
}

export function ViewModeToggle({ viewMode, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center space-x-1 bg-white rounded-full p-1 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 rounded-full ${viewMode === "list" ? "bg-[#FFF0EE] text-[#FFA69E]" : "text-[#888888]"}`}
        onClick={() => onChange("list")}
        title="Vista de lista"
      >
        <List className="h-4 w-4" />
        <span className="sr-only">Vista de lista</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 rounded-full ${viewMode === "gallery" ? "bg-[#FFF0EE] text-[#FFA69E]" : "text-[#888888]"}`}
        onClick={() => onChange("gallery")}
        title="Vista de galería"
      >
        <Grid className="h-4 w-4" />
        <span className="sr-only">Vista de galería</span>
      </Button>
    </div>
  )
}
