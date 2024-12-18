import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { Line } from "react-chartjs-2";
import axios from "../../services/api/adminApi";
import "chart.js/auto";

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState("MONTHLY");
  const [salesData, setSalesData] = useState(null);
  const [filter, setFilter] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSalesReport = async (filter, startDate, endDate) => {
    setLoading(true);
    setError("");
    try {
      const params = { filter, startDate, endDate };
      const response = await axios.get("/sales-report", { params });
      setSalesData(response.data);
    } catch (err) {
      console.error("Error fetching sales report:", err);
      setError("Failed to fetch sales data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesReport(filter, startDate, endDate);
  }, [filter, startDate, endDate]);

  const downloadReport = async (type) => {
    try {
      const params = { filter, startDate, endDate };
      const url = `/sales-report/download-${type}`;
      const response = await axios.get(url, { params, responseType: "blob" });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `sales_report.${type}`;
      a.click();
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  const chartData = {
    labels: salesData?.chart?.labels || ["No Data"],
    datasets: [
      {
        label: "Sales Amount",
        data: salesData?.chart?.data || [0],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "#3B82F6",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          beginAtZero: true,
          callback: (value) => `₹${value}`, // Format Y-axis values as currency
        },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">Home &gt; Dashboard</div>
          {/* <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            {startDate && endDate
              ? `${startDate} - ${endDate}`
              : 'Select a Date Range'}
          </div> */}
        </div>
      </div>

      {/* Filters and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-md lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Filters</h2>
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Timeframe
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="yearly">Yearly</option>
            <option value="custom">Custom</option>
          </select>

          {filter === "custom" && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <input
                type="date"
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="date"
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={() => downloadReport("pdf")}
              className="w-full mb-2 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Download PDF
            </button>
            <button
              onClick={() => downloadReport("excel")}
              className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Download Excel
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Sales Graph
          </h2>
          {loading ? (
            <p className="text-center text-gray-600">Loading chart...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          )}
        </div>
      </div>

      {/* Sales Summary */}
      {salesData && (
        <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Sales Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Total Sales</h3>
              <p className="text-xl font-bold text-indigo-600">
                {salesData.overallSalesCount}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">
                Total Amount
              </h3>
              <p className="text-xl font-bold text-green-600">
                ₹{salesData.overallOrderAmount}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">
                Total Discounts
              </h3>
              <p className="text-xl font-bold text-red-600">
                ₹{salesData.overallDiscount}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
