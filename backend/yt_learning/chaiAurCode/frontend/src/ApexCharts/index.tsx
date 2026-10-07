import React from "react";
import Chart from "react-apexcharts";

export function ApexChartsLine() {
    // 1. Data series format
    const series = [
        {
            name: "Revenue",
            data: [4000, 3000, 5000, 4500, 6000, 5500],
        },
    ];

    // 2. Comprehensive config object
    const options = {
        chart: {
            type: "line",
            zoom: { enabled: false },
            toolbar: { show: true }, // Built-in download (SVG, PNG, CSV), zoom, pan
        },
        stroke: {
            curve: "smooth", // Matches Recharts monotone & Chart.js tension
            width: 2,
        },
        colors: ["#2563eb"],
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        },
        grid: {
            borderColor: "#e5e7eb",
        },
        tooltip: {
            enabled: true,
        },
        legend: {
            position: "top",
        },
    };

    return (
        <div style={{ width: "100%", height: 300 }}>
            <Chart options={options} series={series} type="line" height="100%" />
        </div>
    );
}