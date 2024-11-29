import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import AddTransaction from './AddTransaction';
import { toggleTheme } from '../features/themeSlice';
import { getTransactions, deleteTransaction, editTransaction } from '../features/transactionSlice';

const TransactionList = () => {
    const dispatch = useDispatch();
    const { transactions, loading, error, totalExpense, totalIncome } = useSelector((state) => state.transactions);
    const { theme } = useSelector((state) => state.theme); // Get current theme
    const [IsPremium, setIsPremium] = useState(false);

    // State for the edit modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);

    useEffect(() => {
        dispatch(getTransactions());
    }, [dispatch]);

    const handleDelete = (transactionId) => {
        dispatch(deleteTransaction(transactionId));
    };

    const handleEdit = (transaction) => {
        setCurrentTransaction(transaction);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setCurrentTransaction(null);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (currentTransaction) {
            dispatch(editTransaction({ transactionId: currentTransaction._id, transactionData: currentTransaction }));
            handleCloseEditModal();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentTransaction({ ...currentTransaction, [name]: value });
    };

    // Handle theme toggle
    const handleThemeToggle = () => {
        dispatch(toggleTheme());
    };

    const handlePremiumToggle = () => {
        setIsPremium(!IsPremium);
    };

    // Function to generate CSV from transactions
    const generateCSV = () => {
        const header = ["Title", "Amount", "Type", "Category", "Date"];
        const rows = transactions.map(transaction => [
            transaction.title,
            transaction.amount,
            transaction.type,
            transaction.category,
            new Date(transaction.date).toLocaleDateString(),
        ]);

        const csvContent = [
            header.join(","), // Join header
            ...rows.map(row => row.join(",")), // Join rows
        ].join("\n");

        return csvContent;
    };

    // Handle file download
    const handleDownloadFile = () => {
        const csvContent = generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'transactions.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={theme}> {/* Dynamically apply the theme class */}
            <AddTransaction />
            <h1>Transaction List</h1>
            {IsPremium && (
                <Button variant="secondary" onClick={handleThemeToggle} className="theme-toggle-btn">
                    Toggle {theme === 'light' ? 'Dark' : 'Light'} Theme
                </Button>
            )}

            {/* Display Total Income and Expense */}
            <div className="totals-section">
                <h3>Total Income: <span style={{ color: "green" }}>₹{totalIncome}</span></h3>
                <h3>Total Expense: <span style={{ color: "red" }}>₹{totalExpense}</span></h3>
            </div>

            {totalExpense > 10000 && (
                <div className="premium-alert">
                    <Alert variant="warning" className="d-flex justify-content-between align-items-center">
                        <span>Your expenses have exceeded ₹10,000!</span>
                        <Button variant="primary" onClick={handlePremiumToggle}>Activate Premium</Button>
                    </Alert>
                </div>
            )}

            {/* Add Download File Button */}
            {IsPremium && (
                <Button variant="success" onClick={handleDownloadFile} className="download-btn">
                    Download Expenses as CSV
                </Button>
            )}

            {loading && <p>Loading transactions...</p>}
            {error && <p>{error}</p>}

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions && transactions.length > 0 ? (
                        transactions.map((transaction) => (
                            <tr key={transaction._id}>
                                <td>{transaction.title}</td>
                                <td>{transaction.amount}</td>
                                <td>{transaction.type}</td>
                                <td>{transaction.category}</td>
                                <td>{new Date(transaction.date).toLocaleDateString('en-GB')}</td>
                                
                                <td>
                                    <Button variant="warning" onClick={() => handleEdit(transaction)}>
                                        Edit
                                    </Button>
                                    {' '}
                                    <Button variant="danger" onClick={() => handleDelete(transaction._id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                                No transactions available
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {currentTransaction && (
                <Modal show={showEditModal} onHide={handleCloseEditModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Transaction</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleEditSubmit}>
                            <Form.Group className="mb-3" controlId="formTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={currentTransaction.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formAmount">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="amount"
                                    value={currentTransaction.amount}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formType">
                                <Form.Label>Type</Form.Label>
                                <Form.Select
                                    name="type"
                                    value={currentTransaction.type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Income">Income</option>
                                    <option value="Expense">Expense</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formCategory">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="category"
                                    value={currentTransaction.category}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formDate">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    value={new Date(currentTransaction.date).toISOString().split('T')[0]}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Save Changes
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
};

export default TransactionList;
