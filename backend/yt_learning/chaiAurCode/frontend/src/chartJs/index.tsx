import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { chartJsData } from "../assets/data";

// Chart.js requires manual component registration for tree-shaking
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: "top" },
        tooltip: { enabled: true },
    },
    scales: {
        x: {
            grid: { display: true, color: "#e5e7eb" },
        },
        y: {
            grid: { display: true, color: "#e5e7eb" },
        },
    },
};

export function ChartJsLine() {
    return (
        <div style={{ width: "100%", height: 300 }}>
            <Line data={chartJsData} options={options} />
        </div>
    );
}