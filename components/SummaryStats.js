import { Card, Text, Metric, Icon } from "@tremor/react";

export default function SummaryStats({ data }) {
  const stats = [
    {
      title: "Total Reports",
      value: data.total_reports,
      icon: "📊",
      color: "blue",
    },
    {
      title: "Active Hotspots",
      value: data.hotspot_count,
      icon: "🔥",
      color: "red",
    },
    {
      title: "Average Severity",
      value: data.avg_severity ? data.avg_severity.toFixed(1) + "/10" : "N/A",
      icon: "⚠️",
      color: "amber",
    },
    {
      title: "Waste Types",
      value: Object.keys(data.waste_type_counts || {}).length,
      icon: "♻️",
      color: "emerald",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          decoration="top"
          decorationColor={stat.color}
          className="shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="text-2xl">{stat.icon}</div>
            <div>
              <Text>{stat.title}</Text>
              <Metric>{stat.value}</Metric>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
