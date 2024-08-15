export function UnderConstruction({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return process.env.NODE_ENV === "production" ? (
    <p>🚧 under construction</p>
  ) : (
    children
  );
}
