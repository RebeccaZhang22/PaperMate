import { Paper } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { PaperCard } from "./PaperCard";

interface PaperListProps {
  papers: Paper[];
  isLoading: boolean;
  onPaperClick: (paper: Paper) => void;
}

export function PaperList({ papers, isLoading, onPaperClick }: PaperListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-12 w-12 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="columns-2 sm:columns-2 lg:columns-3 gap-6 space-y-6 [&>*]:break-inside-avoid">
      {papers.map((paper) => (
        <PaperCard key={paper.entry_id} paper={paper} onClick={onPaperClick} />
      ))}
    </div>
  );
}
