import { Paper } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface PaperCardProps {
  paper: Paper;
  onClick: (paper: Paper) => void;
}

export function PaperCard({ paper, onClick }: PaperCardProps) {
  return (
    <motion.div
      layoutId={`card-${paper.entry_id}`}
      onClick={() => onClick(paper)}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base ">{paper.title}</CardTitle>
          <p className="text-xs text-muted-foreground line-clamp-3">
            {paper.authors}
          </p>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-3">
          <p className="text-xs text-muted-foreground line-clamp-3">
            {paper.abstract}
          </p>
          <div className="flex items-center justify-between text-xs">
            <div className="text-muted-foreground">
              {new Date(paper.published).toLocaleDateString()}
            </div>
            <Button
              variant="outline"
              size="sm"
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <a
                href={paper.entry_id}
                target="_blank"
                rel="noopener noreferrer"
              >
                查看原文
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
