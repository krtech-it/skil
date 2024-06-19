import { IBreadcrumbItem } from "@quark-uilib/components";

export interface IHeaderPageProps {
  breadcrumbs?: IBreadcrumbItem[];
  title: string;
  description?: string;
  leadContent?: JSX.Element;
  maxNoCollapsedItems?: number;
  isBackButton?: boolean;
}
