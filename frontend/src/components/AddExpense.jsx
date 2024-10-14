import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function AddExpense({ handleAddExpense }) {
    const navigation = useNavigate()
  const [newExpense, setNewExpense] = useState({
    title: '',
    type: 'outcome', // Default to outcome
    category: '',
    description: '',
    amount: 0,
  });

  const baseUrl = "http://localhost:3009";

  // Handles input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handles form submission to add new expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('authToken'); // Get token from cookies
      const response = await axios.post(
        `${baseUrl}/expense/addExpense`, 
        { 
          title: newExpense.title,
          type: newExpense.type,
          category: newExpense.category,
          description: newExpense.description,
          expense_amount: newExpense.amount // Match the backend variable
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Auth header
        }
      );
      
      // Add the new expense to the list in the parent component
      handleAddExpense(response.data.data);
      
      // Reset the form fields to their default values
      setNewExpense({ title: '', type: 'outcome', category: '', description: '', amount: 0 });
      window.location.reload();

    } catch (error) {
      console.error('Error adding expense:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-bold mb-4">Add New Expense</h3>
      
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
        name="amount"
        value={newExpense.amount}
        onChange={handleChange}
        placeholder="Amount"
        className="border rounded px-3 py-2 mb-4 w-full"
        min="0"
      />
      
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
      >
        Add Expense
      </button>
    </form>
  );
}

export default AddExpense;
