export default function SectionCard({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="cardHeader">
        <div className="cardIcon">{icon}</div>
        <div className="cardTitle">{title}</div>
      </div>
      <div className="cardBody">{children}</div>
    </div>
  );
}
