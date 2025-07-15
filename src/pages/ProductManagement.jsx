import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { Info, Trash2, Edit, X } from 'lucide-react';

const categories = ['All', 'Meals', 'Starters', 'Desserts', 'Beverages'];

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const outletId = localStorage.getItem('outletId');
    
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productToRemove, setProductToRemove] = useState(null);
    const [productToEdit, setProductToEdit] = useState(null);
    
    // Form states
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: '',
        threshold: '',
        minValue: '',
        outletId: outletId 
    });

    // Edit form states
    const [editFormData, setEditFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: '',
        threshold: '',
        minValue: '',
        outletId: outletId 
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedCategory === 'All') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(product => product.category === selectedCategory));
        }
    }, [products, selectedCategory]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await apiRequest(`/admin/outlets/get-products/${outletId}`);
            setProducts(response.data || []);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch products');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                threshold: parseInt(formData.threshold) || 10,
                minValue: parseInt(formData.minValue) || 0,
                outletId: parseInt(formData.outletId)
            };

            await apiRequest('/admin/outlets/add-product/', {
                method: 'POST',
                body: productData
            });

            setShowAddModal(false);
            resetFormData();
            fetchProducts();
            alert('Product added successfully!');
        } catch (err) {
            alert(err.message || 'Failed to add product');
        }
    };

    const handleEditProduct = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                ...editFormData,
                price: parseFloat(editFormData.price),
                threshold: parseInt(editFormData.threshold) || 10,
                minValue: parseInt(editFormData.minValue) || 0,
                outletId: parseInt(editFormData.outletId)
            };

            await apiRequest(`/admin/outlets/update-product/${productToEdit.id}`, {
                method: 'PUT',
                body: productData
            });

            setShowEditModal(false);
            setProductToEdit(null);
            resetEditFormData();
            fetchProducts();
            alert('Product updated successfully!');
        } catch (err) {
            alert(err.message || 'Failed to update product');
        }
    };

    const handleRemoveProduct = async () => {
        if (!productToRemove) return;
        
        try {
            await apiRequest(`/admin/outlets/delete-product/${productToRemove.id}`, {
                method: 'DELETE'
            });
            
            setShowRemoveModal(false);
            setProductToRemove(null);
            fetchProducts();
            alert('Product removed successfully!');
        } catch (err) {
            alert(err.message || 'Failed to remove product');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetFormData = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            imageUrl: '',
            category: '',
            threshold: '',
            minValue: '',
            outletId: outletId
        });
    };

    const resetEditFormData = () => {
        setEditFormData({
            name: '',
            description: '',
            price: '',
            imageUrl: '',
            category: '',
            threshold: '',
            minValue: '',
            outletId: outletId
        });
    };

    const openRemoveModal = (product) => {
        setProductToRemove(product);
        setShowRemoveModal(true);
    };

    const openDetailsModal = (product) => {
        setSelectedProduct(product);
        setShowDetailsModal(true);
    };

    const openEditModal = (product) => {
        setProductToEdit(product);
        setEditFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            imageUrl: product.imageUrl || '',
            category: product.category,
            threshold: product.inventory?.threshold?.toString() || '',
            minValue: product.minValue?.toString() || '0',
            outletId: product.outletId.toString()
        });
        setShowEditModal(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading products...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4">
            <h1 className="text-4xl font-bold">Product Management</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Filter & Action Buttons */}
            <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                    <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border rounded-md"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="flex space-x-2">
                    <Button 
                        variant='success' 
                        onClick={() => setShowAddModal(true)}
                    >
                        Add Product
                    </Button>
                </div>
            </div>

            {/* Products Grid */}
            <Card title='All Products'>
                <div className="max-h-96 overflow-y-auto scrollbar-hide">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="relative">
                                <Card>
                                    <div className="space-y-3">
                                        {/* Category as heading */}
                                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                                            {product.category}
                                        </h3>
                                        
                                        {/* Product Image */}
                                        <div className="aspect-square overflow-hidden rounded-md">
                                            <img
                                                src={product.imageUrl || '/api/placeholder/200/200'}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = '/api/placeholder/200/200';
                                                }}
                                            />
                                        </div>
                                        
                                        {/* Product Name and Price */}
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-medium text-gray-900 truncate flex-1 mr-2">
                                                {product.name}
                                            </h4>
                                            <span className="font-bold text-green-600">
                                                ${product.price}
                                            </span>
                                        </div>
                                        
                                        {/* Stock Info */}
                                        <div className="text-sm text-gray-600">
                                            <div>Stock: {product.inventory?.quantity || 0}</div>
                                            <div>Min Value: {product.minValue || 0}</div>
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex justify-between items-center pt-2">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openDetailsModal(product)}
                                                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    <Info className="w-4 h-4 mr-1" />
                                                    Details
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    className="flex items-center text-green-600 hover:text-green-800 text-sm"
                                                >
                                                    <Edit className="w-4 h-4 mr-1" />
                                                    Edit
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => openRemoveModal(product)}
                                                className="flex items-center text-red-600 hover:text-red-800 text-sm"
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                    
                    {filteredProducts.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No products found for the selected category.
                        </div>
                    )}
                </div>
            </Card>

            {/* Add Product Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Add New Product"
                footer={
                    <div className="flex space-x-2">
                        <Button
                            variant="secondary"
                            onClick={() => setShowAddModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="success"
                            onClick={handleAddProduct}
                        >
                            Add Product
                        </Button>
                    </div>
                }
            >
                <form onSubmit={handleAddProduct} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Category</option>
                                {categories.filter(cat => cat !== 'All').map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image URL
                        </label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Alert Threshold
                            </label>
                            <input
                                type="number"
                                name="threshold"
                                value={formData.threshold}
                                onChange={handleInputChange}
                                min="0"
                                placeholder="10"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Min Value *
                            </label>
                            <input
                                type="number"
                                name="minValue"
                                value={formData.minValue}
                                onChange={handleInputChange}
                                required
                                min="0"
                                placeholder="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Stock will reset to this value daily at midnight
                            </p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Outlet ID *
                            </label>
                            <input
                                type="number"
                                name="outletId"
                                value={formData.outletId}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </form>
            </Modal>

            {/* Edit Product Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Product"
                footer={
                    <div className="flex space-x-2">
                        <Button
                            variant="secondary"
                            onClick={() => setShowEditModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="success"
                            onClick={handleEditProduct}
                        >
                            Update Product
                        </Button>
                    </div>
                }
            >
                <form onSubmit={handleEditProduct} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={editFormData.name}
                            onChange={handleEditInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={editFormData.description}
                            onChange={handleEditInputChange}
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={editFormData.price}
                                onChange={handleEditInputChange}
                                required
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={editFormData.category}
                                onChange={handleEditInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Category</option>
                                {categories.filter(cat => cat !== 'All').map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image URL
                        </label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={editFormData.imageUrl}
                            onChange={handleEditInputChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Alert Threshold
                            </label>
                            <input
                                type="number"
                                name="threshold"
                                value={editFormData.threshold}
                                onChange={handleEditInputChange}
                                min="0"
                                placeholder="10"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Min Value *
                            </label>
                            <input
                                type="number"
                                name="minValue"
                                value={editFormData.minValue}
                                onChange={handleEditInputChange}
                                required
                                min="0"
                                placeholder="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Stock will reset to this value daily at midnight
                            </p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Outlet ID *
                            </label>
                            <input
                                type="number"
                                name="outletId"
                                value={editFormData.outletId}
                                onChange={handleEditInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </form>
            </Modal>

            {/* Remove Product Modal */}
            <Modal
                isOpen={showRemoveModal}
                onClose={() => setShowRemoveModal(false)}
                title="Remove Product"
                footer={
                    <div className="flex space-x-2">
                        <Button
                            variant="secondary"
                            onClick={() => setShowRemoveModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleRemoveProduct}
                        >
                            Remove
                        </Button>
                    </div>
                }
            >
                <p className="text-gray-700">
                    Are you sure you want to remove "{productToRemove?.name}"? This action cannot be undone.
                </p>
            </Modal>

            {/* Product Details Modal */}
            <Modal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                title="Product Details"
                footer={
                    <div className="flex space-x-2">
                        <Button
                            variant="secondary"
                            onClick={() => setShowDetailsModal(false)}
                        >
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                setShowDetailsModal(false);
                                openEditModal(selectedProduct);
                            }}
                        >
                            Edit Product
                        </Button>
                    </div>
                }
            >
                {selectedProduct && (
                    <div className="space-y-4">
                        <div className="aspect-square w-48 mx-auto overflow-hidden rounded-md">
                            <img
                                src={selectedProduct.imageUrl || '/api/placeholder/200/200'}
                                alt={selectedProduct.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = '/api/placeholder/200/200';
                                }}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <div>
                                <span className="font-semibold">Name: </span>
                                <span>{selectedProduct.name}</span>
                            </div>
                            <div>
                                <span className="font-semibold">Description: </span>
                                <span>{selectedProduct.description}</span>
                            </div>
                            <div>
                                <span className="font-semibold">Price: </span>
                                <span className="text-green-600 font-bold">${selectedProduct.price}</span>
                            </div>
                            <div>
                                <span className="font-semibold">Category: </span>
                                <span>{selectedProduct.category}</span>
                            </div>
                            <div>
                                <span className="font-semibold">Min Value: </span>
                                <span className="text-blue-600 font-semibold">{selectedProduct.minValue || 0}</span>
                            </div>
                            <div>
                                <span className="font-semibold">Outlet ID: </span>
                                <span>{selectedProduct.outletId}</span>
                            </div>
                            {selectedProduct.inventory && (
                                <>
                                    <div>
                                        <span className="font-semibold">Current Stock: </span>
                                        <span className="text-orange-600 font-semibold">{selectedProduct.inventory.quantity}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold">Alert Threshold: </span>
                                        <span>{selectedProduct.inventory.threshold}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ProductManagement;