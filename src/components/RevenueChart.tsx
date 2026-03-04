import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subMonths, startOfMonth, isAfter } from "date-fns";

interface Order {
  total_amount: number;
  status: string;
  created_at: string;
}

interface RevenueChartProps {
  orders: Order[];
}

const RevenueChart = ({ orders }: RevenueChartProps) => {
  const chartData = useMemo(() => {
    const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));
    const months: Record<string, number> = {};

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(new Date(), i);
      months[format(d, "yyyy-MM")] = 0;
    }

    orders
      .filter((o) => o.status !== "cancelled" && isAfter(new Date(o.created_at), sixMonthsAgo))
      .forEach((o) => {
        const key = format(new Date(o.created_at), "yyyy-MM");
        if (key in months) months[key] += o.total_amount;
      });

    return Object.entries(months).map(([key, revenue]) => ({
      month: format(new Date(key + "-01"), "MMM"),
      revenue,
    }));
  }, [orders]);

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(345 55% 45%)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(345 55% 45%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(345 25% 18%)" />
          <XAxis
            dataKey="month"
            tick={{ fill: "hsl(345 15% 55%)", fontSize: 12 }}
            axisLine={{ stroke: "hsl(345 25% 18%)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "hsl(345 15% 55%)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(345 35% 10%)",
              border: "1px solid hsl(345 25% 18%)",
              borderRadius: "8px",
              color: "hsl(40 30% 90%)",
              fontSize: 13,
            }}
            formatter={(value: number) => [`$${value.toFixed(0)}`, "Revenue"]}
            labelStyle={{ color: "hsl(345 15% 55%)" }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="hsl(345 55% 45%)"
            strokeWidth={2}
            fill="url(#revenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
