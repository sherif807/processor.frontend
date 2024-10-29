import { useState, useEffect } from 'react';
import QuantityDropdown from './QuantityDropdown';
import ConditionDropdown from './ConditionDropdown';

export default function CombinedItemForm({
  initialQuantity,   
  initialCondition,  
  initialNotes,       
  onQuantityChange,
  onConditionChange,
  onNotesChange,
}) {
  // Local state to handle form inputs
  const [quantity, setQuantity] = useState(initialQuantity);
  const [condition, setLocalCondition] = useState(initialCondition);
  const [notes, setLocalNotes] = useState(initialNotes);
  const [isEditing, setIsEditing] = useState(false);

  // Sync with parent when the initial values change (e.g. after reset)
  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  useEffect(() => {
    setLocalCondition(initialCondition);
  }, [initialCondition]);

  useEffect(() => {
    setLocalNotes(initialNotes);
  }, [initialNotes]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onQuantityChange(quantity);
    onConditionChange(condition);
    setIsEditing(false);
  };

  return (
    <div className="p-4 border rounded">
      {isEditing ? (
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1">
            <label className="block text-xs text-gray-500">Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500">Condition:</label>
            <select
              value={condition}
              onChange={(e) => setLocalCondition(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value={1000}>New</option>
              <option value={1500}>Open Box</option>
              <option value={3000}>Used</option>
            </select>
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 mt-4 md:mt-0"
          >
            Save
          </button>
        </div>
      ) : (
        <div onClick={handleEditClick} className={`cursor-pointer text-sm ${quantity > 1 ? 'bg-green-200 text-gray-800 p-2 rounded' : 'text-gray-500'}`}>
          Quantity: {quantity}, Item Condition: {condition == 1000 ? 'New' : condition == 1500 ? 'Open Box' : condition == 3000 ? 'Used' : 'Unknown'}
        </div>
      )}

      {/* Notes Section */}
      {/* <div className="mt-4">
        <label className="block text-xs text-gray-500">Notes:</label>
        <textarea
          className="mt-2 w-full p-2 border rounded"
          placeholder="Add notes"
          value={notes}
          onChange={(e) => setLocalNotes(e.target.value)}  // Update local state
          onBlur={() => onNotesChange(notes)}  // Notify parent about the change
        />
      </div> */}
    </div>
  );
}
