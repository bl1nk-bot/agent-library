import { BookSidebar } from "@/components/book/sidebar";

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container py-6 lg:py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <BookSidebar />
        <div className="min-w-0 flex-1 lg:mr-64">
          <div className="mx-auto max-w-3xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
