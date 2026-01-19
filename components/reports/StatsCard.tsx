import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  description?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  description,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <div className="text-blue-600">{icon}</div>
      </div>
      <div className="mb-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}
