export default function SectorCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="card" style={{ padding: 14 }}>
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div style={{ fontWeight: 600, marginTop: 6 }}>{title}</div>
      <div style={{ fontSize: 13, opacity: 0.7 }}>{desc}</div>
    </div>
  );
}
