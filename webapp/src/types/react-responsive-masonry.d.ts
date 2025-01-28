declare module "react-responsive-masonry" {
  import { ReactNode } from "react";

  interface MasonryProps {
    columnsCount?: number;
    gutter?: string;
    children?: ReactNode;
  }

  interface ResponsiveMasonryProps {
    columnsCountBreakPoints?: Record<number, number>;
    children?: ReactNode;
  }

  export default function Masonry(props: MasonryProps): JSX.Element;
  export function ResponsiveMasonry(props: ResponsiveMasonryProps): JSX.Element;
}
