import Link from "next/link";

export type Crumb = {
  name: string;
  path: string;
};

/**
 * Breadcrumb visivel. Os mesmos itens alimentam o BreadcrumbList do JSON-LD,
 * entao o schema nunca descreve uma trilha diferente da que esta na tela.
 */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Trilha de navegação" className="text-sm text-neutral-800">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.path} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link href={item.path} className="underline">
                  {item.name}
                </Link>
              )}
              {isLast ? null : <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
