import type { PageLayoutProps } from "../../types/components";

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <main className="p-4 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-black">Find SF Food Trucks</h1>
        <p className="text-black mt-2">
          Discover nearby food trucks in San Francisco using your current location
        </p>
      </header>
      {children}
    </main>
  );
}
