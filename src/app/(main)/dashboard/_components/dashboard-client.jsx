'use client';
import DashboardView from './dashboard-view';

export default function DashboardClient({ insights }) {
  return (
    <div className="container mx-auto">
      <DashboardView insights={insights} />
    </div>
  );
}
