import React from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';

const data = [
    { name: 'Eating Out', value: 25, color: '#FF6666' },
    { name: 'Transport', value: 50, color: '#00C49F' },
    { name: 'Groceries', value: 15, color: '#FFB347' },
    { name: 'Entertainment', value: 10, color: '#6A5ACD' },
];

const DonutChart = () => {
    const total = data.reduce((sum, entry) => sum + entry.value, 0);

    return (
        <div style={{ textAlign: 'center', position: 'relative' }}>
            <div className="h-10rem">
                <PieChart width={300} height={300}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={90} // Makes the donut thinner
                        outerRadius={100} // Adjusts the overall size
                        paddingAngle={-5} // Adds spacing between segments
                        cornerRadius={10} // Rounds the edges of segments
                        stroke="none"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    
                </PieChart>
                {/* <div className="font-semi-bold" style={{ fontSize: '50px', position: 'relative', top: '47%', left: '36%', transform: 'translate(-50%, -50%)' }}>
                    872
                </div>
                <div style={{ fontSize: '30px', fontWeight: 'normal', position: 'relative', top: '60%', left: '37%', transform: 'translate(-50%, -50%)' }}>
                    MKD
                </div> */}
                
                
            <Legend
                layout="vertical"
                align="center"
                verticalAlign="middle"
                payload={data.map((entry) => ({
                    value: entry.name,
                    type: 'square', // Changes legend marker to a rounded circle
                    color: entry.color,
                }))}
            />
               
            </div>
        </div>
    );
};

export default DonutChart;
