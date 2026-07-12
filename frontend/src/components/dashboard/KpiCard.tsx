type KpiCardProps = {
  title: string;
  value: string;
  borderColor: string;
};

function KpiCard({ title, value, borderColor }: KpiCardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border-l-4 ${borderColor} p-5`}
    >
      <p className="text-sm text-slate-500">{title}</p>

      <h2 className="text-3xl font-bold mt-2 text-slate-800">
        {value}
      </h2>
    </div>
  );
}

export default KpiCard;