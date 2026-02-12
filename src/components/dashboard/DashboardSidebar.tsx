'use client';

import { Zap, ArrowRight } from 'lucide-react';
import DashboardStatsGrid from './DashboardStatsGrid';

interface DashboardSidebarProps {
  onRecommendationClick?: () => void;
  onFinancialsClick?: () => void;
}

export default function DashboardSidebar({ onRecommendationClick, onFinancialsClick }: DashboardSidebarProps) {
  return (
    <div className="space-y-6">
       
       <DashboardStatsGrid />
       

    </div>
  );
}
