import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import type { CartItem as CartItemType } from "@/types/cart";

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateItem, removeItem } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const handleUpdateQuantity = () => {
    updateItem(item.id, quantity);
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <div className="flex items-center py-4 border-b">
      <div className="w-20 h-20 flex-shrink-0">
        <img
          src={item.productImage || "/placeholder.png"}
          alt={item.productName}
          className="w-full h-full object-cover rounded"
        />
      </div>

      <div className="ml-4 flex-grow">
        <h3 className="font-medium text-gray-900">{item.productName}</h3>
        <p className="text-gray-600">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(item.productPrice)}
        </p>
      </div>

      <div className="flex items-center">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          onBlur={handleUpdateQuantity}
          className="w-16 text-center border rounded p-1 mr-2"
        />

        <button
          onClick={handleRemove}
          className="text-red-600 hover:text-red-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
