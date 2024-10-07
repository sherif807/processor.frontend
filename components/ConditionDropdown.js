import { useState, useEffect } from 'react';

export default function ConditionDropdown({ initialCondition, onConditionChange, itemId }) {
  const [itemCondition, setItemCondition] = useState(initialCondition || 1000);

  const handleConditionChange = (e) => {
    const newCondition = parseInt(e.target.value);
    setItemCondition(newCondition);
    onConditionChange(newCondition);  // Pass the new condition to the parent
  };

  // If the initialCondition changes, update the local state
  useEffect(() => {
    setItemCondition(initialCondition);
  }, [initialCondition]);

  return (
    <div className="mt-2">
      <label htmlFor={`condition-${itemId}`} className="block text-xs text-gray-500">Item Condition:</label>
      <select
        id={`condition-${itemId}`}
        value={itemCondition}
        onChange={handleConditionChange}
        className="border rounded p-1 text-sm"
        style={{ width: '150px' }}
      >
        <option value={1000}>New</option>
        <option value={1500}>Open box</option>
        <option value={3000}>Used</option>
      </select>
    </div>
  );
}
