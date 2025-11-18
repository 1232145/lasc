import React from 'react';

interface StatsCardsProps {
  events: number;
  rsvps: number;
  sponsors: number;
  photos: number;
}

export default function StatsCards({ events, rsvps, sponsors, photos }: StatsCardsProps) {
  const stats = [
    { 
      label: "Total Events", 
      value: events, 
      color: "text-orange-600",
      bg: "bg-orange-50"
    },
    { 
      label: "Total RSVPs", 
      value: rsvps, 
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    { 
      label: "Sponsors", 
      value: sponsors, 
      color: "text-red-600",
      bg: "bg-red-50"
    },
    { 
      label: "Gallery Photos", 
      value: photos, 
      color: "text-green-600",
      bg: "bg-green-50"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bg} p-6 rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-all duration-300`}
        >
          <h3 className="text-sm font-medium text-stone-600 mb-2">
            {stat.label}
          </h3>
          <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

