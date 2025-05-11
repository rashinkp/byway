import { ChevronRight } from "lucide-react";
import { Course } from "@/types/cart";

interface OrderDetailsProps {
  courseDetails: Course[];
  onProceed: () => void;
  isDisabled: boolean;
}

export default function OrderDetails({
  courseDetails,
  onProceed,
  isDisabled,
}: OrderDetailsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Order Details
      </h2>
      {courseDetails.length === 0 ? (
        <div className="text-center text-gray-600">No courses selected</div>
      ) : (
        <div className="space-y-4">
          {courseDetails.map((course) => (
            <div key={course.id} className="flex items-start border-b pb-4">
              <div className="bg-blue-100 rounded-md p-2 mr-4">
                <img
                  src={course.thumbnail || ""}
                  alt={course.title}
                  className="w-20 h-20 object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{course.title}</h3>
                <p className="text-sm text-gray-600">{course.level} Level</p>
                {course.duration && (
                  <p className="text-sm text-gray-600">
                    Duration: {course.duration}
                  </p>
                )}
                <div className="mt-2">
                  <span className="text-gray-600 line-through">
                    $
                    {(typeof course.price === "string"
                      ? parseFloat(course.price)
                      : course.price
                    ).toFixed(2)}
                  </span>
                  <span className="ml-2 text-blue-700 font-semibold">
                    $
                    {(typeof course.offer === "string"
                      ? parseFloat(course.offer)
                      : course.offer
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={onProceed}
          disabled={isDisabled}
          className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-8 rounded-md font-medium transition duration-300 disabled:bg-gray-400"
        >
          Proceed to Payment
          <ChevronRight className="ml-2 inline" size={16} />
        </button>
      </div>
    </div>
  );
}
