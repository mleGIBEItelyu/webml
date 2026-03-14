'use client';
import DashboardStatsGrid from './DashboardStatsGrid';
import type { StockSignal } from '@/lib/types/signal';

interface DashboardSidebarProps {
  onRecommendationClick?: () => void;
  onFinancialsClick?: () => void;
  signal?: StockSignal | null;
  isLoading?: boolean;
}

export default function DashboardSidebar({ 
  onRecommendationClick, 
  onFinancialsClick,
  signal,
  isLoading 
}: DashboardSidebarProps) {
  return (
    <div className="space-y-6">
       <DashboardStatsGrid signal={signal} isLoading={isLoading} />
    </div>
  );
}
