export default function MROLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto">
      <div className="flex min-h-screen flex-col space-y-6">
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
