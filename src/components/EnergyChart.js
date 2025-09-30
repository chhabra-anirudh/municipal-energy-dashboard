import { useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function EnergyChart({ data }) {
  const chartRef = useRef(null);

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 italic p-6">
        No energy data available.
      </div>
    );
  }

  const labels = data.map((d) => d["Operation Name"]);
  const chartData = {
    labels,
    datasets: [
      {
        label: "Electricity (kWh)",
        data: data.map(
          (d) => d["Electricity Quantity Purchased and Consumed"] || 0
        ),
        backgroundColor: "rgba(59, 130, 246, 0.7)", // Tailwind blue-500
        hoverBackgroundColor: "rgba(59, 130, 246, 0.9)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: "Natural Gas (m³)",
        data: data.map(
          (d) => d["Natural Gas Quantity Purchased and Consumed"] || 0
        ),
        backgroundColor: "rgba(239, 68, 68, 0.7)", // Tailwind red-500
        hoverBackgroundColor: "rgba(239, 68, 68, 0.9)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { usePointStyle: true, padding: 16, font: { size: 12 } },
      },
      tooltip: {
        callbacks: {
          title: (context) => labels[context[0].dataIndex],
          label: (context) => {
            const value = context.raw || 0;
            return `${context.dataset.label}: ${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { autoSkip: false, maxRotation: 25, font: { size: 11 } },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => value.toLocaleString() },
        grid: { color: "rgba(209,213,219,0.3)" },
      },
    },
  };

  // Export PNG
  const handleDownloadPNG = () => {
    if (!chartRef.current) return;
    const url = chartRef.current.toBase64Image();
    const a = document.createElement("a");
    a.href = url;
    a.download = "energy-chart.png";
    a.click();
  };

  // Export CSV
  const handleDownloadCSV = () => {
    const rows = [
      ["Operation Name", "Electricity (kWh)", "Natural Gas (m³)"],
      ...data.map((d) => [
        d["Operation Name"],
        d["Electricity Quantity Purchased and Consumed"] || 0,
        d["Natural Gas Quantity Purchased and Consumed"] || 0,
      ]),
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = encodeURI(csvContent);
    a.download = "energy-data.csv";
    a.click();
  };

  return (
    <div className="w-full">
      {/* Chart */}
      <div className="h-96">
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>

      {/* Export buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={handleDownloadPNG}
          className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
        >
          📥 Download PNG
        </button>
        <button
          onClick={handleDownloadCSV}
          className="px-4 py-2 text-sm font-medium text-green-600 border border-green-300 rounded-lg bg-green-50 hover:bg-green-100 transition"
        >
          📊 Export CSV
        </button>
      </div>
    </div>
  );
}

export default EnergyChart;
