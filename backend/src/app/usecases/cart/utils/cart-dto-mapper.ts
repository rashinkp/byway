import { Cart } from "../../../../domain/entities/cart.entity";
import { CartResponseDTO } from "../../../dtos/cart.dto";

export function mapCartToDTO(cart: Cart): CartResponseDTO {
  const cartData = cart.toJSON();
  
  return {
    ...cartData,
    course: cart.course ? {
      id: cart.course.id,
      title: cart.course.title,
      description: cart.course.description,
      thumbnail: cart.course.thumbnail,
      price: cart.course.price?.getValue() ? Number(cart.course.price.getValue()) : null,
      offer: cart.course.offer?.getValue() ? Number(cart.course.offer.getValue()) : null,
      duration: cart.course.duration?.getValue() ?? null,
      level: cart.course.level.toString(),
      lessons: cart.course.lessons,
      rating: cart.course.rating,
      reviewCount: cart.course.reviewCount,
      bestSeller: cart.course.bestSeller,
    } : undefined,
  };
}
