import {
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export type BarChartEntry = {
  name: string;
  value: number;
};

type BarChartProps = {
  data: BarChartEntry[];
  title: string;
  color?: string;
};

export default function BarChart({ data, title, color = "#22c55e" }: BarChartProps) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm flex-1 flex flex-col gap-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ResponsiveContainer width="100%" height={180}>
        <RBarChart data={data} barSize={28}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={36}
            allowDecimals={false}
          />
          <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} />
          <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} name="Total" />
        </RBarChart>
      </ResponsiveContainer>
    </div>
  );
}
