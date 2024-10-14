import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import AddExpense from './AddExpense';

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(0);
  const [image, setImage] = useState('');
  const [selectedExpense, setSelectedExpense] = useState(null); // Store the expense selected for editing
  const [isEditMode, setIsEditMode] = useState(false); // Track if we're in edit mode
  const [isAddMode, setIsAddMode] = useState(false); // Track if "Add Expense" is triggered
  const baseUrl = "http://localhost:3009";

  // Fetch account details and expenses
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(`${baseUrl}/user/getUser`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = response.data.data[0];
        setName(userData.username);
        setBalance(userData.balance || 0);
        setImage(`http://localhost:3009/images/${userData.profile_image || ''}`);
      } catch (error) {
        console.error('Error fetching user data:', error.response ? error.response.data : error.message);
      }
    };

    const fetchExpenses = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(`${baseUrl}/expense/getExpense`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(response.data.data);
      } catch (error) {
        console.error('Error fetching expenses:', error.response ? error.response.data : error.message);
      }
    };

    fetchUser();
    fetchExpenses();
  }, []);

  const handleAddExpense = (newExpense) => {
    setExpenses([...expenses, newExpense]);
    setIsAddMode(false); // Exit "Add Mode" after adding the expense
  };

  const handleUpdateExpense = async (id, updatedExpenseData) => {
    try {
      const token = Cookies.get('authToken');
      await axios.put(`${baseUrl}/expense/editExpense/${id}`, updatedExpenseData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update state with the new expense data
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === id ? { ...expense, ...updatedExpenseData } : expense
        )
      );

      setIsEditMode(false); // Exit edit mode after update
      setSelectedExpense(null); // Clear selected expense
      console.log('Expense updated successfully');
    } catch (error) {
      console.error('Error updating expense:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const token = Cookies.get('authToken');
      await axios.delete(`${baseUrl}/expense/deleteExpense/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted expense from state
      setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
      console.log('Expense deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting expense:', error.response ? error.response.data : error.message);
    }
  };

  // Fix: Set the selected expense for editing
  const handleEditClick = (expense) => {
    setSelectedExpense(expense); // Set the expense to be edited
    setIsEditMode(true); // Enable edit mode
    setIsAddMode(false); // Disable add mode in case it's active
  };

  const handleAddClick = () => {
    setIsAddMode(true); // Enable add mode
    setSelectedExpense(null); // Clear selected expense
    setIsEditMode(false); // Disable edit mode
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      {/* Layout with two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Account Information */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <img
            src={image}
            alt="Account"
            className=" w-96 h-96 rounded-full object-cover mb-6"
          />
          <h2 className="text-4xl font-bold text-center mb-2">{name}</h2>
          <p className="text-2xl text-gray-600 text-center">Balance: <span className="font-semibold">${balance}</span></p>
        </div>

        {/* Right Column: Expense Management */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {isAddMode || isEditMode ? (
            <AddExpense
              handleAddExpense={handleAddExpense}
              selectedExpense={selectedExpense}
              isEditMode={isEditMode}
              handleUpdateExpense={handleUpdateExpense}
            />
          ) : (
            <button
              onClick={handleAddClick}
              className="text-blue-500 hover:underline"
            >
              Add New Expense
            </button>
          )}
        </div>
      </div>

      {/* Expenses Table Below Two-Column Layout */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-bold mb-4">Expense List</h3>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left text-sm font-semibold">
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Type</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => {
              if (!expense) return null; // Skip if expense is undefined

              return (
                <tr key={expense.id} className="border-b hover:bg-gray-50">
                  <td className="border px-4 py-2">{expense.title || 'N/A'}</td>
                  <td className={`border px-4 py-2 ${expense.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {expense.type || 'N/A'}
                  </td>
                  <td className="border px-4 py-2">{expense.category || 'N/A'}</td>
                  <td className="border px-4 py-2">${expense.expense_amount || 0}</td>
                  <td className="border px-4 py-2">{expense.description || 'N/A'}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEditClick(expense)}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="mx-2 text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                    {/* Add button in the Actions */}
                    <button
                      onClick={handleAddClick}
                      className="text-green-500 hover:underline"
                    >
                      Add Expense
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpensePage;
