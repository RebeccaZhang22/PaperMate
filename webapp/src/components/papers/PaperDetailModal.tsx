import { Paper } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface PaperDetailModalProps {
  paper: Paper | null;
  recommendedPapers: Paper[];
  onClose: () => void;
  onPaperClick: (paper: Paper) => void;
}

export function PaperDetailModal({
  paper,
  recommendedPapers,
  onClose,
  onPaperClick,
}: PaperDetailModalProps) {
  return (
    <AnimatePresence mode="wait">
      {paper && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, type: "spring" }}
            className="fixed inset-0 bg-black"
            onClick={onClose}
          />

          {/* 内容卡片 */}
          <motion.div
            layoutId={`card-${paper.entry_id}`}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed inset-4 lg:inset-[10%] bg-background rounded-lg shadow-xl overflow-y-auto"
          >
            <div className="h-full p-6">
              <div className="flex flex-col lg:flex-row gap-6 h-full">
                {/* 左侧/上方：当前论文详情 */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{paper.title}</h2>
                      <p className="text-muted-foreground">{paper.authors}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                      <span className="text-2xl">×</span>
                    </Button>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">摘要</h4>
                      <p className="text-sm leading-relaxed">
                        {paper.abstract}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">分类</h4>
                      <p className="text-sm">{paper.categories}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">发布时间</h4>
                      <p className="text-sm">
                        {new Date(paper.published).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Button asChild>
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
                </div>

                {/* 右侧/下方：推荐论文列表 */}
                <div className="w-full lg:w-80 border-t lg:border-l lg:border-t-0 pt-6 lg:pt-0 lg:pl-6">
                  <h3 className="font-semibold mb-4">相关论文</h3>
                  <div className="space-y-4">
                    {recommendedPapers.map((paper) => (
                      <Card
                        key={paper.entry_id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => onPaperClick(paper)}
                      >
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm">
                            {paper.title}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {paper.abstract}
                          </p>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
