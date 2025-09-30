import { useRef } from "react";
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
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function EmissionsTrend({ data, building }) {
  const chartRef = useRef(null);
  const filtered = data.filter((d) => d["Operation Name"] === building);

  if (!filtered || filtered.length === 0) {
    return (
      <div className="text-center text-gray-500 italic p-6">
        No emissions data available for {building}.
      </div>
    );
  }

  const years = filtered.map((d) => d.Year);
  const emissions = filtered.map((d) => d["Total GHG Emissions (KG)"] || 0);

  const chartData = {
    labels: years,
    datasets: [
      {
        label: `${building} GHG (kg)`,
        data: emissions,
        borderColor: "rgba(59,130,246,1)", // Tailwind blue-500
        backgroundColor: "rgba(59,130,246,0.15)", // subtle gradient fill
        fill: true,
        pointBackgroundColor: "rgba(59,130,246,1)",
        pointHoverBackgroundColor: "#ffffff",
        pointBorderColor: "#ffffff",
        pointHoverBorderColor: "rgba(59,130,246,1)",
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        tension: 0.35,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 16,
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw || 0;
            return `${context.dataset.label}: ${value.toLocaleString()} kg`;
          },
        },
      },
      title: {
        display: true,
        text: "GHG Emissions Trend Over Time",
        font: { size: 16, weight: "bold" },
        padding: { top: 8, bottom: 16 },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 25,
          minRotation: 0,
          font: { size: 11 },
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value.toLocaleString(),
        },
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
    a.download = "emissions-trend.png";
    a.click();
  };

  // Export CSV
  const handleDownloadCSV = () => {
    const rows = [["Year", "GHG Emissions (kg)"]];
    years.forEach((year, idx) => {
      rows.push([year, emissions[idx]]);
    });
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = encodeURI(csvContent);
    a.download = "emissions-trend.csv";
    a.click();
  };

  return (
    <div className="w-full">
      <div className="h-80 sm:h-96">
        <Line ref={chartRef} data={chartData} options={options} />
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

export default EmissionsTrend;
