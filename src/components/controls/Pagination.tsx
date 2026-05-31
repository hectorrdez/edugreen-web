import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import StringUtils from "../../utils/StringUtils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(currentPage, totalPages);

  return (
    <nav
      aria-label="Paginación"
      className={StringUtils.JoinClassName(
        "flex items-center justify-center gap-1",
        className,
      )}
    >
      <PageArrow
        direction="prev"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-secondary select-none">
            …
          </span>
        ) : (
          <PageButton
            key={p}
            page={p as number}
            active={p === currentPage}
            onClick={() => onPageChange(p as number)}
          />
        ),
      )}

      <PageArrow
        direction="next"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </nav>
  );
}

function PageButton({
  page,
  active,
  onClick,
}: {
  page: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={StringUtils.JoinClassName(
        "w-9 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer",
        active
          ? "bg-primary text-black"
          : "bg-white border border-gray-200 text-secondary hover:border-primary hover:text-primary-dark",
      )}
    >
      {page}
    </button>
  );
}

function PageArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Página anterior" : "Página siguiente"}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-secondary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:border-primary hover:enabled:text-primary-dark"
    >
      {direction === "prev" ? (
        <IconChevronLeft size={16} />
      ) : (
        <IconChevronRight size={16} />
      )}
    </button>
  );
}

function buildPageList(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}
