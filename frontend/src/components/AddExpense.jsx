import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function AddExpense({ handleAddExpense, selectedExpense, isEditMode, handleUpdateExpense }) {
  const navigation = useNavigate();
  
  // Initialize state with empty or selected expense
  const [newExpense, setNewExpense] = useState({
    title: '',
    type: 'outcome',
    category: '',
    description: '',
    expense_amount: 0, // Renamed from 'amount' to 'expense_amount'
  });

  const baseUrl = "http://localhost:3009";

  // Populate form with selected expense data when in edit mode
  useEffect(() => {
    if (isEditMode && selectedExpense) {
      setNewExpense({
        title: selectedExpense.title,
        type: selectedExpense.type,
        category: selectedExpense.category,
        description: selectedExpense.description,
        expense_amount: selectedExpense.expense_amount, // Ensure it's named correctly
      });
    }
  }, [isEditMode, selectedExpense]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submit for adding or updating an expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('authToken'); // Get token from cookies
    
    try {
      if (isEditMode) {
        // Update existing expense
        await axios.put(
          `${baseUrl}/expense/editExpense/${selectedExpense.id}`, 
          {
            title: newExpense.title,
            type: newExpense.type,
            category: newExpense.category,
            description: newExpense.description,
            expense_amount: newExpense.expense_amount, // Updated field name
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        handleUpdateExpense({ ...newExpense, id: selectedExpense.id });
      } else {
        // Add new expense
        const response = await axios.post(
          `${baseUrl}/expense/addExpense`, 
          {
            title: newExpense.title,
            type: newExpense.type,
            category: newExpense.category,
            description: newExpense.description,
            expense_amount: newExpense.expense_amount, // Updated field name
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        handleAddExpense(response.data.data);
      }
      
      // Reset form fields after submission
      setNewExpense({ title: '', type: 'outcome', category: '', description: '', expense_amount: 0 });
      window.location.reload();
    } catch (error) {
      console.error('Error submitting expense:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-bold mb-4">
        {isEditMode ? 'Update Expense' : 'Add New Expense'}
      </h3>
      
      <input
        type="text"
        name="title"
        value={newExpense.title}
        onChange={handleChange}
        placeholder="Title"
        className="border rounded px-3 py-2 mb-4 w-full"
      />
      
      <select
        name="type"
        value={newExpense.type}
        onChange={handleChange}
        className="border rounded px-3 py-2 mb-4 w-full"
      >
        <option value="outcome">Outcome</option>
        <option value="income">Income</option>
      </select>
      
      <input
        type="text"
        name="category"
        value={newExpense.category}
        onChange={handleChange}
        placeholder="Category"
        className="border rounded px-3 py-2 mb-4 w-full"
      />
      
      <textarea
        name="description"
        value={newExpense.description}
        onChange={handleChange}
        placeholder="Description"
        className="border rounded px-3 py-2 mb-4 w-full"
      />
      
      <input
        type="number"
        name="expense_amount" // Updated field name
        value={newExpense.expense_amount} // Updated field name
        onChange={handleChange}
        placeholder="Amount"
        className="border rounded px-3 py-2 mb-4 w-full"
        min="0"
      />
      
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
      >
        {isEditMode ? 'Update Expense' : 'Add Expense'}
      </button>
    </form>
  );
}

export default AddExpense;
