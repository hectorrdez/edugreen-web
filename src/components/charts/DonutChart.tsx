import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Label } from "recharts";

export type DonutChartEntry = {
  name: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  data: DonutChartEntry[];
  centerLabel: string;
  title: string;
};

export default function DonutChart({ data, centerLabel, title }: DonutChartProps) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm flex-1 flex flex-col gap-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={75}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
            <Label
              value={centerLabel}
              position="center"
              style={{ fontSize: "22px", fontWeight: "700", fill: "#111827" }}
            />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-2">
        {data.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="ml-auto font-semibold">
              {entry.value.toLocaleString("es-ES")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
