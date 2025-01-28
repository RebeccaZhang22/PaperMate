import { Input } from "@/components/ui/input";

interface NavbarProps {
  searchKeyword: string;
  onSearchChange: (value: string) => void;
}

export function Navbar({ searchKeyword, onSearchChange }: NavbarProps) {
  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">PaperMate</h1>
          <div className="w-1/3">
            <Input
              type="text"
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="搜索论文..."
              className="w-full"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
