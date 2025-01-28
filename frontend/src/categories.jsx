import { useState, useEffect } from 'react';
import './styles.css';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [updatedCategory, setUpdatedCategory] = useState({ id: '', name: '' });
  const [deleteCategoryId, setDeleteCategoryId] = useState('');
  const [loading, setLoading] = useState(false); // To handle loading state
  const [error, setError] = useState(''); // To handle errors

  const apiUrl = 'http://localhost:3004/api/categories';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl);
      const result = await response.json();
      setCategories(result.data?.categories || []);
      setError(''); // Clear error after successful fetch
    } catch (error) {
      setError('Error fetching categories');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      alert('Category name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Category added successfully');
        setNewCategory('');
        fetchCategories();
      } else {
        alert('Error adding category');
      }
    } catch (error) {
      alert('Error adding category');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    const { id, name } = updatedCategory;
    if (!id || !name.trim()) {
      alert('Category ID and new name are required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Category updated successfully');
        setUpdatedCategory({ id: '', name: '' });
        fetchCategories();
      } else {
        alert('Error updating category');
      }
    } catch (error) {
      alert('Error updating category');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (e) => {
    e.preventDefault();
    if (!deleteCategoryId.trim()) {
      alert('Category ID is required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/delete/${deleteCategoryId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        alert('Category deleted successfully');
        setDeleteCategoryId('');
        fetchCategories();
      } else {
        alert('Error deleting category');
      }
    } catch (error) {
      alert('Error deleting category');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Categories Management</h1>

      {loading && <p>Loading...</p>} {/* Display loading message while fetching data */}

      {error && <p className="error">{error}</p>} {/* Display error message if any */}

      {/* Add Category Form */}
      <div className="form-section">
        <h2>Add Category</h2>
        <form onSubmit={handleAddCategory}>
          <label>Category Name:</label>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>Add Category</button>
        </form>
      </div>

      {/* Update Category Form */}
      <div className="form-section">
        <h2>Update Category</h2>
        <form onSubmit={handleUpdateCategory}>
          <label>Category ID:</label>
          <input
            type="text"
            value={updatedCategory.id}
            onChange={(e) => setUpdatedCategory({ ...updatedCategory, id: e.target.value })}
            required
          />
          <label>New Category Name:</label>
          <input
            type="text"
            value={updatedCategory.name}
            onChange={(e) => setUpdatedCategory({ ...updatedCategory, name: e.target.value })}
            required
          />
          <button type="submit" disabled={loading}>Update Category</button>
        </form>
      </div>

      {/* Delete Category Form */}
      <div className="form-section">
        <h2>Delete Category</h2>
        <form onSubmit={handleDeleteCategory}>
          <label>Category ID:</label>
          <input
            type="text"
            value={deleteCategoryId}
            onChange={(e) => setDeleteCategoryId(e.target.value)}
            required
          />
          <button type="submit" className="delete-button" disabled={loading}>Delete Category</button>
        </form>
      </div>

      {/* Display Category List */}
      <div className="category-list">
        <h2>All Categories</h2>
        {categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Category ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category._id}</td>
                  <td>{category.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CategoriesManagement;
