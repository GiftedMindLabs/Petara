import React, { useState } from 'react';
import { pets } from '../../utils/mockData';
interface ExpenseFormProps {
  expense?: {
    id: string;
    petId: string;
    date: string;
    amount: number;
    category: string;
    description: string;
    vendor: string;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}
const ExpenseForm: React.FC<ExpenseFormProps> = ({
  expense,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    petId: expense?.petId || '',
    date: expense?.date || '',
    amount: expense?.amount || '',
    category: expense?.category || 'veterinary',
    description: expense?.description || '',
    vendor: expense?.vendor || ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pet
        </label>
        <select value={formData.petId} onChange={e => setFormData({
        ...formData,
        petId: e.target.value
      })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required>
          <option value="">Select a pet</option>
          {pets.map(pet => <option key={pet.id} value={pet.id}>
              {pet.name}
            </option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input type="date" value={formData.date} onChange={e => setFormData({
          ...formData,
          date: e.target.value
        })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input type="number" value={formData.amount} onChange={e => setFormData({
          ...formData,
          amount: e.target.value
        })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" min="0" step="0.01" required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select value={formData.category} onChange={e => setFormData({
        ...formData,
        category: e.target.value
      })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required>
          <option value="veterinary">Veterinary Care</option>
          <option value="food">Food</option>
          <option value="supplies">Supplies</option>
          <option value="grooming">Grooming</option>
          <option value="medications">Medications</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vendor
        </label>
        <input type="text" value={formData.vendor} onChange={e => setFormData({
        ...formData,
        vendor: e.target.value
      })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea value={formData.description} onChange={e => setFormData({
        ...formData,
        description: e.target.value
      })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" rows={3} />
      </div>
      <div className="flex space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          {expense ? 'Save Changes' : 'Add Expense'}
        </button>
      </div>
    </form>;
};
export default ExpenseForm;