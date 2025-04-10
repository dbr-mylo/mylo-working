
import React from "react";
import { CheckIcon, FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SortOption = "newest" | "oldest" | "a-z" | "z-a" | "recently-edited";
export type FilterOption = "all" | "documents" | "templates" | "completed" | "draft";

interface DocumentFiltersProps {
  sortBy: SortOption;
  filterBy: FilterOption;
  onSortChange: (option: SortOption) => void;
  onFilterChange: (option: FilterOption) => void;
}

export const DocumentFilters = ({
  sortBy,
  filterBy,
  onSortChange,
  onFilterChange,
}: DocumentFiltersProps) => {
  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center">
            <FilterIcon className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={filterBy === "all"}
            onCheckedChange={() => onFilterChange("all")}
          >
            All Items
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filterBy === "documents"}
            onCheckedChange={() => onFilterChange("documents")}
          >
            Documents Only
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filterBy === "templates"}
            onCheckedChange={() => onFilterChange("templates")}
          >
            Templates Only
          </DropdownMenuCheckboxItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={filterBy === "completed"}
            onCheckedChange={() => onFilterChange("completed")}
          >
            Completed
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filterBy === "draft"}
            onCheckedChange={() => onFilterChange("draft")}
          >
            Drafts
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Sort
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={sortBy === "newest"}
            onCheckedChange={() => onSortChange("newest")}
          >
            Newest First
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={sortBy === "oldest"}
            onCheckedChange={() => onSortChange("oldest")}
          >
            Oldest First
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={sortBy === "recently-edited"}
            onCheckedChange={() => onSortChange("recently-edited")}
          >
            Recently Edited
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={sortBy === "a-z"}
            onCheckedChange={() => onSortChange("a-z")}
          >
            Name (A-Z)
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={sortBy === "z-a"}
            onCheckedChange={() => onSortChange("z-a")}
          >
            Name (Z-A)
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
