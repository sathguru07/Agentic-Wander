
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface CostChartProps {
    costBreakdown: {
        transport: string;
        stay: string;
        food: string;
        activities: string;
    };
    totalBudget: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

const CostChart: React.FC<CostChartProps> = ({ costBreakdown, totalBudget }) => {
    const data = [
        { name: 'Transport', value: parseInt(costBreakdown.transport.replace(/\D/g, '')) || 1 },
        { name: 'Stay', value: parseInt(costBreakdown.stay.replace(/\D/g, '')) || 1 },
        { name: 'Food', value: parseInt(costBreakdown.food.replace(/\D/g, '')) || 1 },
        { name: 'Activities', value: parseInt(costBreakdown.activities.replace(/\D/g, '')) || 1 },
    ];

    return (
        <div className="flex items-center justify-center h-48">
            <div className="relative w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', fontSize: '11px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-purple-300">₹{totalBudget}</p>
                    <p className="text-xs text-slate-500 mt-1">Total Budget</p>
                </div>
            </div>
        </div>
    );
};

export default CostChart;
