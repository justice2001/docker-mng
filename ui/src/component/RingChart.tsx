import React from 'react';
import EChartsReact, { EChartsOption } from 'echarts-for-react';

type RingChartProps = {
  data: number;
  color?: string[];
  width?: string | number;
};

const RingChart: React.FC<RingChartProps> = (props: RingChartProps) => {
  const chartOption: EChartsOption = {
    series: [
      {
        name: 'Ring',
        type: 'pie',
        radius: ['80%', '100%'],
        avoidLabelOverlap: false,
        labelLine: {
          show: false,
        },
        label: {
          show: false,
        },
        silent: true,
        data: [
          { value: props.data, name: 'Used' },
          { value: 1 - props.data, name: 'Free' },
        ],
        itemStyle: {
          color: (colors: any) => {
            const list = props.color || ['#40de00', '#E8EFF5'];
            return list[colors.dataIndex];
          },
        },
      },
    ],
  };

  return <EChartsReact option={chartOption} style={{ height: props.width || '60px', width: props.width || '60px' }} />;
};

export default RingChart;
