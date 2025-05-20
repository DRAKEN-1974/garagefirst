'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import './admin.css'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image_url: string
  category: string
  created_at: string
}

interface Coupon {
  id: string
  code: string
  discount: number
  expires_at: string
  is_active: boolean
  created_at: string
}

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [products, setProducts] = useState<Product[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(true)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    image_url: ''
  })
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: 0,
    expires_at: ''
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
    fetchCoupons()
    
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to fetch products')
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCoupons(data || [])
    } catch (error) {
      console.error('Error fetching coupons:', error)
      setError('Failed to fetch coupons')
    } finally {
      setIsLoadingCoupons(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      let imageUrl = ''
      if (selectedImage) {
        imageUrl = await handleImageUpload(selectedImage)
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...newProduct,
          image_url: imageUrl,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock)
        }])
        .select()

      if (error) throw error

      setProducts([...(data || []), ...products])
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: '',
        image_url: ''
      })
      setSelectedImage(null)
      setSuccess('Product added successfully')
    } catch (error) {
      console.error('Error adding product:', error)
      setError('Failed to add product')
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      setProducts(products.filter(product => product.id !== id))
      setSuccess('Product deleted successfully')
    } catch (error) {
      console.error('Error deleting product:', error)
      setError('Failed to delete product')
    }
  }

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      const { data, error } = await supabase
        .from('coupons')
        .insert([{
          ...newCoupon,
          discount: Number(newCoupon.discount),
          is_active: true
        }])
        .select()

      if (error) throw error

      setCoupons([...(data || []), ...coupons])
      setNewCoupon({
        code: '',
        discount: 0,
        expires_at: ''
      })
      setSuccess('Coupon added successfully')
    } catch (error) {
      console.error('Error adding coupon:', error)
      setError('Failed to add coupon')
    }
  }

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return

    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id)

      if (error) throw error

      setCoupons(coupons.filter(coupon => coupon.id !== id))
      setSuccess('Coupon deleted successfully')
    } catch (error) {
      console.error('Error deleting coupon:', error)
      setError('Failed to delete coupon')
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="current-datetime">
          {currentTime.toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'medium'
          })}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="dashboard-grid">
        {/* Products Section */}
        <div className="section products-section">
          <h2>Products Management</h2>
          
          <form onSubmit={handleAddProduct} className="add-form">
            <h3>Add New Product</h3>
            
            <div className="form-group">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="number"
                  placeholder="Stock"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                <option value="parts">Parts</option>
                <option value="accessories">Accessories</option>
                <option value="tools">Tools</option>
              </select>
            </div>

            <div className="form-group">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                required
              />
            </div>

            <button type="submit" className="submit-button">
              Add Product
            </button>
          </form>

          <div className="items-list">
            <h3>Current Products</h3>
            {isLoadingProducts ? (
              <div className="loading">Loading products...</div>
            ) : (
              <div className="items-grid">
                {products.map((product) => (
                  <div key={product.id} className="item-card">
                    <img src={product.image_url} alt={product.name} />
                    <div className="item-details">
                      <h4>{product.name}</h4>
                      <p>{product.description}</p>
                      <p className="price">${product.price}</p>
                      <p className="stock">Stock: {product.stock}</p>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Coupons Section */}
        <div className="section coupons-section">
          <h2>Coupons Management</h2>
          
          <form onSubmit={handleAddCoupon} className="add-form">
            <h3>Add New Coupon</h3>
            
            <div className="form-group">
              <input
                type="text"
                placeholder="Coupon Code"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="number"
                placeholder="Discount (%)"
                value={newCoupon.discount}
                onChange={(e) => setNewCoupon({...newCoupon, discount: Number(e.target.value)})}
                min="0"
                max="100"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="datetime-local"
                value={newCoupon.expires_at}
                onChange={(e) => setNewCoupon({...newCoupon, expires_at: e.target.value})}
                required
              />
            </div>

            <button type="submit" className="submit-button">
              Add Coupon
            </button>
          </form>

          <div className="items-list">
            <h3>Active Coupons</h3>
            {isLoadingCoupons ? (
              <div className="loading">Loading coupons...</div>
            ) : (
              <div className="items-grid">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="coupon-card">
                    <div className="coupon-details">
                      <h4>{coupon.code}</h4>
                      <p className="discount">{coupon.discount}% OFF</p>
                      <p className="expiry">
                        Expires: {new Date(coupon.expires_at).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}