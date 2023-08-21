import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import AddProductForm from './AddMedicine'; // Import the new component
import { Alert, Button } from 'react-bootstrap';

function ViewMedicine() {
    const emailid = useSelector(state => state.email);
    const [products, setProducts] = useState([]);
    const [sortColumn, setSortColumn] = useState('pid');
    const [sortDirection, setSortDirection] = useState('asc');
    const [filters, setFilters] = useState({ pid: '', pname: '', price: '', qty: '' });
    const [remainingBalance, setRemainingBalance] = useState(null);
    const [fetchingBalance, setFetchingBalance] = useState(false);
    const location = useLocation();
    const isCustomerRoute = location.pathname.startsWith('/Customer');
    const isAdminRoute = location.pathname.startsWith('/Admin');
    const [selectedForDeletion, setSelectedForDeletion] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editedProduct, setEditedProduct] = useState(null);
    const [orderedQuantities, setOrderedQuantities] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('success');



    const fetchProducts = async () => {
        try {
            const response = await fetch("http://54.162.14.59:8080/product/viewProductDetails");
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSort = (column, event) => {
        if (event.target.tagName.toLowerCase() !== 'input') {
            if (column === sortColumn) {
                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
            } else {
                setSortColumn(column);
                setSortDirection('asc');
            }
        }
    };

    const handleEdit = (product) => {
        setEditMode(true);
        setEditedProduct(product);
        setSelectedForDeletion([]);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditedProduct(null);
        setSelectedForDeletion([]);
    };

    const handleUpdateProduct = async () => {
        try {
            const response = await axios.post('http://54.162.14.59:8080/product/updateProductInfo', editedProduct);
            console.log('Product updated:', response.data);
            setEditMode(false);
            setEditedProduct(null);
            // Refresh the product list after update
            fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleCheckboxChange2 = (productId) => {
        setSelectedForDeletion((prevSelected) => {
            if (prevSelected.includes(productId)) {
                return prevSelected.filter((id) => id !== productId);
            } else {
                return [...prevSelected, productId];
            }
        });
    };

    const handleDeleteSelected = async () => {
        if (selectedForDeletion.length === 0) {
            console.error('No products selected for deletion.');
            return;
        }

        try {
            for (const pid of selectedForDeletion) {
            const response = await axios.post('http://54.162.14.59:8080/product/deleteProduct', {
                pid: pid,
            });
            console.log('Products deleted:', response.data);
        }
            // Refresh the product list after deletion
            fetchProducts();
            setSelectedForDeletion([]);
        } catch (error) {
            console.error('Error deleting products:', error);
            alert('Cannot delete this product as it has already been ordered');
        }
    };

    const handleFilterChange = (column, value) => {
        setFilters(prevFilters => ({ ...prevFilters, [column]: value }));
    };

    const getSortIcon = (column) => {
        if (column === sortColumn) {
            return sortDirection === 'asc' ? faSortUp : faSortDown;
        }
        return faSort;
    };

    const handleOrderedQuantityChange = (productId, quantity) => {
        setOrderedQuantities(prevQuantities => ({
            ...prevQuantities,
            [productId]: parseInt(quantity),
        }));
    };

    const handleSubmitOrder = async () => {
        if (!emailid || Object.keys(orderedQuantities).length === 0) {
            console.error('Email or selected products not found.');
            return;
        }

        try {
            const orders = Object.entries(orderedQuantities).map(([productId, quantity]) => ({
                pidid: parseInt(productId),
                account: {
                    email: emailid,
                },
                pidqty: quantity,
            }));
    
            const response = await axios.post("http://54.162.14.59:8080/orders/placeOrder", orders);
        
            console.log("Orders placed:", response.data);
            setShowAlert(true);
        setAlertMessage(response.data);
        setAlertVariant('success');

            const remainingBalanceResponse = await axios.post("http://54.162.14.59:8080/orders/remainingBalance", {
             email: emailid
         });

            // Set the remaining balance in state
            setRemainingBalance(remainingBalanceResponse.data);
            console.log('Remaining Balance:', remainingBalanceResponse.data);

            setOrderedQuantities({});
            fetchProducts();
        } catch (error) {
            console.error('Error placing orders:', error);

            // Display error message to the user
            if (error.response && error.response.data) {
                alert('Error placing orders: ' + error.response.data);
            } else {
                alert('An error occurred while placing orders.');
            }
        }
    };
    
    const handleFetchBalance = async () => {
        try {
            setFetchingBalance(true);
            const response = await axios.post("http://54.162.14.59:8080/orders/remainingBalance", {
                email: emailid
            });
            setRemainingBalance(response.data);
            setFetchingBalance(false);
        } catch (error) {
            console.error('Error fetching remaining balance:', error);
            setFetchingBalance(false);
            // Display error message to the user
            alert('An error occurred while fetching remaining balance.');
        }
    };
    
    const handleFetchOrderDetails = async () => {
        try {
            const response = await axios.post("http://54.162.14.59:8080/orders/viewOrderDetails2", {
                email: emailid
            });
            // Process the order details response as needed
            console.log("Order details:", response.data);
        } catch (error) {
            console.error('Error fetching order details:', error);
            // Display error message to the user
            alert('An error occurred while fetching order details.');
        }
    };

    const handleFieldChange = (field, value) => {
        setEditedProduct(prevEditedProduct => ({
            ...prevEditedProduct,
            [field]: value,
        }));
    };
    

    const filteredProducts = products.filter(product => {
        return (
            product.pid.toString().includes(filters.pid) &&
            product.pname.toLowerCase().includes(filters.pname.toLowerCase()) &&
            (product.price.toFixed(2).includes(filters.price) || filters.price === '') &&
            (product.qty.toString().includes(filters.qty) || filters.qty === '')
        );
    });

    const sortedAndFilteredProducts = [...filteredProducts].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
    
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            if (sortDirection === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            if (sortDirection === 'asc') {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        } else {
            return 0;
        }
    });
    console.log('isCustomerRoute:', isCustomerRoute);

    return (
        <div className="container mt-4">
            
            <h2>View Medicine</h2>
            <p>Email: {emailid}</p>
            {isAdminRoute &&<AddProductForm fetchProducts={fetchProducts} />}
            <div className="remaining-balance">
            {remainingBalance !== null && remainingBalance !== undefined ? (
            <div>
               Remaining Balance: ${remainingBalance.toFixed(2)}
            </div>
        ) : (
            <div>
                
            </div>
        )}
       {isCustomerRoute && <button className="btn btn-primary mt-2" onClick={handleFetchBalance}>
            Click Here to Retrieve Remaining Balance
        </button>}
    </div>
            <div className="table-responsive mt-4">
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th onClick={(e) => handleSort('pid', e)}>
                                ID{' '}
                                <FontAwesomeIcon icon={getSortIcon('pid')} />
                                <input
                                    type="text"
                                    value={filters.pid}
                                    onChange={(e) => handleFilterChange('pid', e.target.value)}
                                />
                            </th>
                            <th onClick={(e) => handleSort('pname', e)}>
                                Name{' '}
                                <FontAwesomeIcon icon={getSortIcon('pname')} />
                                <input
                                    type="text"
                                    value={filters.pname}
                                    onChange={(e) => handleFilterChange('pname', e.target.value)}
                                />
                            </th>
                            <th onClick={(e) => handleSort('price', e)}>
                                Price{' '}
                                <FontAwesomeIcon icon={getSortIcon('price')} />
                                <input
                                    type="text"
                                    value={filters.price}
                                    onChange={(e) => handleFilterChange('price', e.target.value)}
                                />
                            </th>
                            <th onClick={(e) => handleSort('qty', e)}>
                                Quantity{' '}
                                <FontAwesomeIcon icon={getSortIcon('qty')} />
                                <input
                                    type="text"
                                    value={filters.qty}
                                    onChange={(e) => handleFilterChange('qty', e.target.value)}
                                />
                            </th>
                            {isCustomerRoute && <th>Ordered Quantity</th>}
                            {isAdminRoute && <th>Select</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAndFilteredProducts.map(product => (
                            <tr key={product.pid}>
                                <td>{product.pid}</td>
                                <td>
                                {editMode && editedProduct?.pid === product.pid ? (
                                    <input
                                        type="text"
                                        value={editedProduct.pname}
                                        onChange={(e) => handleFieldChange('pname', e.target.value)}
                                    />
                                ) : (
                                    product.pname
                                )}
                            </td>
                            <td>
                                {editMode && editedProduct?.pid === product.pid ? (
                                    <input
                                        type="text"
                                        value={editedProduct.price}
                                        onChange={(e) => handleFieldChange('price', e.target.value)}
                                    />
                                ) : (
                                    product.price
                                )}
                            </td>
                            <td>
                                {editMode && editedProduct?.pid === product.pid ? (
                                    <input
                                        type="text"
                                        value={editedProduct.qty}
                                        onChange={(e) => handleFieldChange('qty', e.target.value)}
                                    />
                                ) : (
                                    product.qty
                                )}
                            </td>
                                {isCustomerRoute && <td>
    <input
        type="number"
        min="1"
        value={product.pidqty}
        onChange={(e) => handleOrderedQuantityChange(product.pid, e.target.value)}
    />
</td>}
                                {isAdminRoute &&  <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedForDeletion.includes(product.pid)}
                                            onChange={() => handleCheckboxChange2(product.pid)}
                                        />
                                    </td>}
                                    
                                    {isAdminRoute && <td>
                                        <button
                                            onClick={() => handleDeleteSelected(product.pid)}
                                            className="btn btn-danger btn-sm"
                                            disabled={!selectedForDeletion.includes(product.pid)}
                                        >
                                            Delete
                                        </button>
                                    </td>}
                                    {isAdminRoute && editMode ?(
                <div>
                    <button onClick={handleUpdateProduct} className="btn btn-primary btn-sm">Save Changes</button>
                    <button onClick={handleCancelEdit} className="btn btn-danger btn-sm">Cancel</button>
                </div>
            ) : (isAdminRoute && 
                <div>
                    <button
                                        onClick={() => handleEdit(product)}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Edit
                                    </button>
    
                </div>
            )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isCustomerRoute && <button className="btn btn-success mt-2" onClick={handleSubmitOrder} disabled={orderedQuantities.length < 1}>
                Submit Order
            </button>}
            {showAlert && (
        <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
            {alertMessage}
        </Alert>
    )}
        </div>
        
    );
}

export default ViewMedicine;
