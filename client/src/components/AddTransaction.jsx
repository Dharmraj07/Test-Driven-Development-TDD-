import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../features/transactionSlice';
import { Button, Modal, Form } from 'react-bootstrap';

const AddTransaction = () => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [transactionData, setTransactionData] = useState({
        title: '',
        amount: '',
        type: 'Income',
        category: '',
        date: '',
    });

    // Handle modal open/close
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTransactionData({ ...transactionData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addTransaction(transactionData)); // Dispatch the action with form data
        handleClose(); // Close the modal
        setTransactionData({
            title: '',
            amount: '',
            type: 'Income',
            category: '',
            date: '',
        }); // Reset form
    };

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>
                Add Transaction
            </Button>

            {/* Modal for adding transaction */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Transaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                name="title"
                                value={transactionData.title}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formAmount">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter amount"
                                name="amount"
                                value={transactionData.amount}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formType">
                            <Form.Label>Type</Form.Label>
                            <Form.Select
                                name="type"
                                value={transactionData.type}
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
                                placeholder="Enter category"
                                name="category"
                                value={transactionData.category}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDate">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={transactionData.date}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Add Transaction
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AddTransaction;
