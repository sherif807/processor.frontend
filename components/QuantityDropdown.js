import { useState } from 'react';

export default function QuantityDropdown({ itemId, initialQuantity, onQuantityChange, setHasChanged }) {
  const [quantity, setQuantity] = useState(initialQuantity || 1);

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(newQuantity);
    
    // Trigger the `setHasChanged` flag in the parent to show the submit button
    if (setHasChanged) setHasChanged(true);

    // Optionally, notify parent about the change (if required)
    if (onQuantityChange) onQuantityChange(newQuantity);
  };

  return (
    <div className="mt-2">
      <label htmlFor={`quantity-${itemId}`} className="block text-xs text-gray-500">Quantity:</label>
      <select
        id={`quantity-${itemId}`}
        value={quantity}
        onChange={handleQuantityChange}
        className="border rounded p-1 text-sm"
        style={{ width: '100px' }}
      >
        {[...Array(10).keys()].map((num) => (
          <option key={num + 1} value={num + 1}>
            {num + 1}
          </option>
        ))}
      </select>
    </div>
  );
}
