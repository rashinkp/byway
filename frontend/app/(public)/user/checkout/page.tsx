
'use client'
import { useState } from "react";
import {
  CreditCard,
  Calendar,
  User,
  BookOpen,
  CheckCircle,
  Lock,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";

// Mock data for course
const courseData = {
  title: "Complete Web Development Bootcamp",
  description: "Master HTML, CSS, JavaScript, React, Node.js and more",
  price: 129.99,
  discountPrice: 89.99,
  duration: "12 weeks",
  lessons: 85,
};

// Define TypeScript interfaces
interface PaymentDetails {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
}

interface BillingDetails {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  });
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    country: "United States",
  });
  const [orderComplete, setOrderComplete] = useState(false);

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBillingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    // Process payment
    setOrderComplete(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">
            Complete Your Purchase
          </h1>
          <p className="text-gray-600 mt-2">
            You're just a few steps away from accessing your course
          </p>
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout area */}
          <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-md p-6">
            {/* Steps indicator */}
            <div className="flex mb-8 border-b pb-4">
              <div
                className={`flex-1 text-center ${
                  activeStep >= 1
                    ? "text-blue-700 font-medium"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    activeStep >= 1
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                Billing
              </div>
              <div
                className={`flex-1 text-center ${
                  activeStep >= 2
                    ? "text-blue-700 font-medium"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    activeStep >= 2
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                Payment
              </div>
              <div
                className={`flex-1 text-center ${
                  activeStep >= 3
                    ? "text-blue-700 font-medium"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    activeStep >= 3
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
                Confirmation
              </div>
            </div>

            {orderComplete ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <CheckCircle size={64} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Order Confirmed!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your payment was successful. You now have access to your
                  course.
                </p>
                <button className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-8 rounded-md font-medium transition duration-300">
                  Start Learning Now
                </button>
              </div>
            ) : (
              <div>
                {activeStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Billing Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={billingDetails.firstName}
                          onChange={handleBillingChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={billingDetails.lastName}
                          onChange={handleBillingChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={billingDetails.email}
                          onChange={handleBillingChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={billingDetails.address}
                          onChange={handleBillingChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={billingDetails.city}
                          onChange={handleBillingChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={billingDetails.zipCode}
                          onChange={handleBillingChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <select
                          name="country"
                          value={billingDetails.country}
                          onChange={handleBillingChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setActiveStep(2)}
                        className="flex items-center bg-blue-700 hover:bg-blue-800 text-white py-3 px-8 rounded-md font-medium transition duration-300"
                      >
                        Continue to Payment{" "}
                        <ChevronRight className="ml-2" size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Payment Details
                    </h2>
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 flex items-center">
                      <Lock className="text-blue-700 mr-3" size={20} />
                      <span className="text-sm text-blue-800">
                        Your payment information is secure and encrypted
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="cardNumber"
                            value={paymentDetails.cardNumber}
                            onChange={handlePaymentChange}
                            placeholder="1234 5678 9012 3456"
                            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                          <CreditCard
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cardholder Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="cardholderName"
                            value={paymentDetails.cardholderName}
                            onChange={handlePaymentChange}
                            placeholder="John Smith"
                            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                          <User
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="expiryDate"
                              value={paymentDetails.expiryDate}
                              onChange={handlePaymentChange}
                              placeholder="MM/YY"
                              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                            <Calendar
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={18}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="cvv"
                              value={paymentDetails.cvv}
                              onChange={handlePaymentChange}
                              placeholder="123"
                              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                            <CreditCard
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={18}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveStep(1)}
                        className="text-blue-700 hover:text-blue-800 py-3 px-6 font-medium transition duration-300"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-8 rounded-md font-medium transition duration-300"
                      >
                        Complete Purchase
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>

              <div className="flex items-start mb-4 pb-4 border-b border-gray-200">
                <div className="bg-blue-100 rounded-md p-2 mr-4">
                  <BookOpen className="text-blue-700" size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    {courseData.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {courseData.description}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Course Price</span>
                  <span className="text-gray-800 line-through">
                    ${courseData.price}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Discounted Price</span>
                  <span className="text-blue-700 font-semibold">
                    ${courseData.discountPrice}
                  </span>
                </div>
              </div>

              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Course Duration</span>
                  <span className="text-gray-800">{courseData.duration}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Total Lessons</span>
                  <span className="text-gray-800">
                    {courseData.lessons} lessons
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 font-semibold">
                <span className="text-gray-800">Total</span>
                <span className="text-xl text-blue-700">
                  ${courseData.discountPrice}
                </span>
              </div>

              <div className="mt-6 bg-blue-50 rounded-md p-4 text-sm text-blue-800">
                <div className="flex items-center mb-2">
                  <ShoppingCart className="text-blue-700 mr-2" size={16} />
                  <span className="font-medium">Your Benefits:</span>
                </div>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Lifetime access to course content</li>
                  <li>24/7 community support</li>
                  <li>Certificate of completion</li>
                  <li>30-day money-back guarantee</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
