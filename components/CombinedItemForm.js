import { useState, useEffect } from 'react';
import QuantityDropdown from './QuantityDropdown';
import ConditionDropdown from './ConditionDropdown';

export default function CombinedItemForm({
  initialQuantity,   
  initialCondition,  
  initialNotes,       
  onQuantityChange,
  setCondition,
  onNotesChange,
}) {
  // Local state to handle form inputs
  const [quantity, setQuantity] = useState(initialQuantity);
  const [condition, setLocalCondition] = useState(initialCondition);
  const [notes, setLocalNotes] = useState(initialNotes);

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

  return (
    <div className="p-4 border rounded">
      {/* Quantity Dropdown */}
      <QuantityDropdown
        initialQuantity={quantity}
        onQuantityChange={(newQuantity) => {
          setQuantity(newQuantity);  // Update local state
          onQuantityChange(newQuantity);  // Notify parent about the change
        }}
      />

      {/* Condition Dropdown */}
      <ConditionDropdown
        initialCondition={condition}
        onConditionChange={(newCondition) => {
          setLocalCondition(newCondition);  // Update local state
          setCondition(newCondition);  // Notify parent about the change
        }}
      />

      {/* Notes Section */}
      <div className="mt-4">
        <label className="block text-xs text-gray-500">Notes:</label>
        <textarea
          className="mt-2 w-full p-2 border rounded"
          placeholder="Add notes"
          value={notes}
          onChange={(e) => setLocalNotes(e.target.value)}  // Update local state
          onBlur={() => onNotesChange(notes)}  // Notify parent about the change
        />
      </div>
    </div>
  );
}
