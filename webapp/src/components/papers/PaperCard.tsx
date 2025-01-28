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
      className="mb-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(paper)}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{paper.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{paper.authors}</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {paper.abstract}
          </p>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              发布时间: {new Date(paper.published).toLocaleDateString()}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
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
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
