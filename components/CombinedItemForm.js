import { useRef } from 'react';
import QuantityDropdown from './QuantityDropdown';
import ConditionDropdown from './ConditionDropdown';

export default function CombinedItemForm({
  quantity,
  condition,
  notes,
  setQuantity,
  setCondition,
  setNotes,
}) {
  const notesRef = useRef(notes);  // Use ref to avoid re-rendering

  const handleNotesChange = (e) => {
    notesRef.current = e.target.value;
  };

  const updateNotes = () => {
    setNotes(notesRef.current); // Only update the parent state when necessary
  };

  return (
    <div className="p-4 border rounded">
      {/* Quantity Dropdown */}
      <QuantityDropdown
        initialQuantity={quantity}
        onQuantityChange={setQuantity}  // This will update the quantity in formInputs
      />

      {/* Condition Dropdown */}
      <ConditionDropdown
        initialCondition={condition}
        onConditionChange={setCondition}  // This will update the condition in formInputs
      />

      {/* Notes Section */}
      <div className="mt-4">
        <label className="block text-xs text-gray-500">Notes:</label>
        <textarea
          className="mt-2 w-full p-2 border rounded"
          placeholder="Add notes"
          defaultValue={notes} // Use defaultValue instead of value to avoid constant re-renders
          onChange={handleNotesChange}  // Update the notesRef value
          onBlur={updateNotes} // Only update the parent state when focus is lost
        />
      </div>
    </div>
  );
}
