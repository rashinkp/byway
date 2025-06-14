"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
  User
} from "lucide-react";

// Dummy data for demonstration
const revenueData = {
  totalRevenue: 125000,
  thisMonth: 25000,
  thisWeek: 8500,
  adminShare: 0.3, // 30% admin share
  recentEarnings: [
    {
      id: 1,
      courseTitle: "Advanced Web Development",
      instructor: "John Doe",
      amount: 299.99,
      date: "2024-03-15",
      status: "completed"
    },
    {
      id: 2,
      courseTitle: "Data Science Fundamentals",
      instructor: "Jane Smith",
      amount: 199.99,
      date: "2024-03-14",
      status: "completed"
    },
    {
      id: 3,
      courseTitle: "UI/UX Design Masterclass",
      instructor: "Mike Johnson",
      amount: 249.99,
      date: "2024-03-13",
      status: "pending"
    },
    {
      id: 4,
      courseTitle: "Mobile App Development",
      instructor: "Sarah Wilson",
      amount: 179.99,
      date: "2024-03-12",
      status: "completed"
    },
    {
      id: 5,
      courseTitle: "Digital Marketing Course",
      instructor: "David Brown",
      amount: 159.99,
      date: "2024-03-11",
      status: "completed"
    }
  ]
};

export default function RevenueAnalytics() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const adminShareAmount = revenueData.totalRevenue * revenueData.adminShare;
  const instructorShareAmount = revenueData.totalRevenue - adminShareAmount;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-gray-900">Revenue Analytics</h1>
              <p className="text-gray-600">Track your platform's financial performance</p>
            </div>
            <Badge 
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Live Data
            </Badge>
          </div>
        </Card>

        {/* Revenue Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                  {formatCurrency(revenueData.totalRevenue)}
                </h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span className="text-sm">12% from last month</span>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                  {formatCurrency(revenueData.thisMonth)}
                </h3>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span className="text-sm">8% from last month</span>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">This Week</p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                  {formatCurrency(revenueData.thisWeek)}
                </h3>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-red-600">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              <span className="text-sm">3% from last week</span>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Admin Share</p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                  {formatCurrency(adminShareAmount)}
                </h3>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">30% of total revenue</span>
            </div>
          </Card>
        </div>

        {/* Recent Earnings List */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 text-gray-900 mb-6">
              <DollarSign className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Recent Earnings</h2>
            </div>
            <div className="space-y-4">
              {revenueData.recentEarnings.map((earning) => (
                <div key={earning.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{earning.courseTitle}</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-1" />
                        {earning.instructor}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(earning.amount)}</p>
                    <p className="text-sm text-gray-500">{formatDate(earning.date)}</p>
                  </div>
                  <Badge 
                    variant="outline"
                    className={earning.status === 'completed' 
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }
                  >
                    {earning.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
