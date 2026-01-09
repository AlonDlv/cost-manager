import {
    BarChart as ReBarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from "recharts";

export default function BarChart({ data }) {
    const chartData = data.map((value, index) => ({
        month: index + 1,
        total: value
    }));

    return (
        <ReBarChart width={600} height={300} data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" />
        </ReBarChart>
    );
}
