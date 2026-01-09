import { PieChart as RePieChart, Pie, Tooltip, Legend } from "recharts";

export default function PieChart({ data }) {
    const chartData = Object.keys(data).map(key => ({
        name: key,
        value: data[key]
    }));

    return (
        <RePieChart width={400} height={400}>
            <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
            />
            <Tooltip />
            <Legend />
        </RePieChart>
    );
}
