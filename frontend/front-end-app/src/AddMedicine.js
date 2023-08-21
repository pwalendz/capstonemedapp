import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

function AddProductForm({ fetchProducts }) {
    const [showForm, setShowForm] = useState(false);
    const [newProduct, setNewProduct] = useState({
        pname: '',
        price: '',
        qty: '',
    });

    const handleAddProductClick = () => {
        setShowForm(true);
    };

    const handleAddProductSubmit = async () => {
        try {
            const response = await axios.post('http://54.162.14.59:8080/product/storeProductInfo', newProduct);
            console.log('Product added:', response.data);
            // Refresh the product list after adding
            fetchProducts();
            setShowForm(false);
            setNewProduct({
                pname: '',
                price: '',
                qty: '',
            });
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <div>
            <Button variant="primary" onClick={handleAddProductClick}>Add Product</Button>
            {showForm && (
                <div>
                    <h3>Add New Product</h3>
                    <Form>
                        <Form.Group>
                        <Form.Label>Name</Form.Label>
                            <Form.Control
                        type="text"
                        placeholder="Name"
                        value={newProduct.pname}
                        onChange={(e) => setNewProduct({ ...newProduct, pname: e.target.value })}
                    />
                    </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                        type="number"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                    </Form.Group>
                        <Form.Group>
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                        type="number"
                        placeholder="Quantity"
                        value={newProduct.qty}
                        onChange={(e) => setNewProduct({ ...newProduct, qty: e.target.value })}
                    />
                    </Form.Group>
                    <Button variant="primary" onClick={handleAddProductSubmit}>Submit Product</Button>
                    </Form>
                </div>
            )}
        </div>
    );
}

export default AddProductForm;
