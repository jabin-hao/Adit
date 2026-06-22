interface FileBreadcrumbProps {
  path: string;
}

export function FileBreadcrumb({ path }: FileBreadcrumbProps) {
  return <span className="text-gray-500 dark:text-gray-400 text-sm">{path}</span>;
}
