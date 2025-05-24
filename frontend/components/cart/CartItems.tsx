import { ICart } from "@/types/cart";
import { CartItem } from "./CartItem";
import { CartItemSkeleton } from "./CartSkeleton";

interface CartItemsProps {
  cart: ICart[];
  isRemoving: boolean;
  removingCourseId?: string;
  onRemoveCourse: (courseId: string) => void;
}

// Cart Items List Component
export function CartItems({
  cart,
  isRemoving,
  removingCourseId,
  onRemoveCourse,
}: CartItemsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {cart.map((item) => (
        <div key={item.id}>
          {isRemoving && removingCourseId === item.courseId ? (
            <CartItemSkeleton />
          ) : (
            <CartItem
              item={item}
              isRemoving={isRemoving}
              onRemove={onRemoveCourse}
            />
          )}
        </div>
      ))}
    </div>
  );
}
