import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useState, useEffect } from 'react';
import { CommitData } from './GitHubProfileAnalyzer';

interface CommitChartProps {
  commitData: CommitData[];
}

export function CommitChart({ commitData }: CommitChartProps) {
  const [chartData, setChartData] = useState<CommitData[]>([]);

  useEffect(() => {
    if (commitData.length > 0) {
      // Process data to show daily commits (no aggregation needed)
      const processedData = commitData.map(({ date, count }) => ({
        date: formatDay(date),
        count,
        fullDate: date, // Keep original date for tooltip
      }));
      setChartData(processedData);
    }
  }, [commitData]);

  const formatDay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
    });
  };

  if (commitData.length === 0) {
    return (
      <Card>
        <CardContent className='p-6'>
          <p className='text-center text-muted-foreground'>
            No commit data available. This could be due to API rate limits or
            the user has no recent activity.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commit Activity</CardTitle>
        <CardDescription>
          Daily commit activity for the past week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='h-[300px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <XAxis
                dataKey='date'
                angle={-45}
                textAnchor='end'
                height={70}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} commits`, 'Commits']}
                labelFormatter={(label) => {
                  // Find the full date for this label
                  const item = chartData.find((item) => item.date === label);
                  return item?.date || label;
                }}
              />
              <Bar dataKey='count' fill='#3b82f6' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
