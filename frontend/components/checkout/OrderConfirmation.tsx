import { CheckCircle } from "lucide-react";

export default function OrderConfirmation() {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <CheckCircle size={64} className="text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Order Confirmed!
      </h2>
      <p className="text-gray-600 mb-6">
        Your payment was successful. You now have access to your course(s).
      </p>
      <button
        className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-8 rounded-md font-medium transition duration-300"
        onClick={() => (window.location.href = "/courses")}
      >
        Start Learning Now
      </button>
    </div>
  );
}
