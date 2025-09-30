import { useState, useEffect } from "react";
import dataset from "../data/energy_emissions_2015_2017.json";
import EnergyChart from "./EnergyChart";
import EmissionsTrend from "./EmissionsTrend";
import PieChart from "./PieChart";
import KPIs from "./KPIs";
import Insights from "./Insights";

function Dashboard() {
  // Normalize year to numbers & ensure sorted order
  const years =
    dataset.length > 0
      ? [...new Set(dataset.map((d) => Number(d.Year)))].sort((a, b) => a - b)
      : [];
  const types =
    dataset.length > 0 ? [...new Set(dataset.map((d) => d["Operation Type"]))] : [];
  const buildings =
    dataset.length > 0 ? [...new Set(dataset.map((d) => d["Operation Name"]))] : [];

  // States
  const [selectedYear, setSelectedYear] = useState(years[0] || null);
  const [selectedType, setSelectedType] = useState(types[0] || null);
  const [selectedBuilding, setSelectedBuilding] = useState(buildings[0] || null);
  const [loading, setLoading] = useState(false);

  // Handle loading simulation when filters change
  useEffect(() => {
    if (selectedYear || selectedType || selectedBuilding) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 500); // simulate fetch delay
      return () => clearTimeout(timer);
    }
  }, [selectedYear, selectedType, selectedBuilding]);

  // Filtered dataset
  const filtered =
    dataset.length > 0
      ? dataset.filter(
          (d) => Number(d.Year) === selectedYear && d["Operation Type"] === selectedType
        )
      : [];

  // If no data, render fallback
  if (!dataset || dataset.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 italic">
        No dataset available.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen relative">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      )}

      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Title + subtitle */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Municipal Energy & GHG Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Interactive analytics for municipal energy & emissions
            </p>
          </div>

          {/* Filters */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-4 flex flex-wrap gap-6 justify-center items-end">
            {/* Year */}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">Year</label>
              <select
                className="border p-2 rounded shadow-sm min-w-[120px]"
                value={selectedYear || ""}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Facility Type */}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">
                Facility Type
              </label>
              <select
                className="border p-2 rounded shadow-sm min-w-[160px]"
                value={selectedType || ""}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Building */}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">Building</label>
              <select
                className="border p-2 rounded shadow-sm min-w-[200px]"
                value={selectedBuilding || ""}
                onChange={(e) => setSelectedBuilding(e.target.value)}
              >
                {buildings.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex">
              <button
                onClick={() => {
                  setSelectedYear(years[0] || null);
                  setSelectedType(types[0] || null);
                  setSelectedBuilding(buildings[0] || null);
                }}
                className="px-4 py-2 border border-blue-500 text-blue-600 rounded-md shadow-sm hover:bg-blue-50 transition"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={`max-w-7xl mx-auto px-4 py-8 transition-opacity duration-300 ${loading ? "opacity-40" : "opacity-100"}`}>
        {/* KPI Section */}
        <div className="mb-8">
          <KPIs
            data={filtered}
            allData={dataset}
            selectedYear={selectedYear}
            selectedType={selectedType}
          />
        </div>

        {/* Insights Section */}
        <div className="mb-10">
          <Insights data={filtered} allData={dataset} selectedYear={selectedYear} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Energy Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200 transition-transform transform hover:scale-[1.02] hover:shadow-md">
            <h2 className="text-lg font-bold text-gray-700 mb-4">⚡ Electricity vs Gas</h2>
            <EnergyChart data={filtered} />
          </div>

          {/* Emissions Trend Line Chart */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200 transition-transform transform hover:scale-[1.02] hover:shadow-md">
            <h2 className="text-lg font-bold text-gray-700 mb-4">📈 Emissions Trend</h2>
            <EmissionsTrend data={dataset} building={selectedBuilding} />
          </div>

          {/* Pie Chart by Facility Type */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200 md:col-span-2 transition-transform transform hover:scale-[1.02] hover:shadow-md">
            <h2 className="text-lg font-bold text-gray-700 mb-4">🏢 Emissions by Facility Type</h2>
            <PieChart data={dataset.filter((d) => Number(d.Year) === selectedYear)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
