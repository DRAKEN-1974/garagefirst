'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Coupon {
  id: string
  code: string
  discount: number
  expires_at: string
  is_active: boolean
}

export default function CouponManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: 0,
    expires_at: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCoupons()
  }, [])

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
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('coupons')
        .insert([{
          code: newCoupon.code.toUpperCase(),
          discount: newCoupon.discount,
          expires_at: newCoupon.expires_at,
          is_active: true
        }])
        .select()

      if (error) throw error

      setCoupons([...(data || []), ...coupons])
      setNewCoupon({ code: '', discount: 0, expires_at: '' })
    } catch (error) {
      console.error('Error creating coupon:', error)
    }
  }

  const handleDeleteCoupon = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        const { error } = await supabase
          .from('coupons')
          .delete()
          .eq('id', id)

        if (error) throw error

        setCoupons(coupons.filter(coupon => coupon.id !== id))
      } catch (error) {
        console.error('Error deleting coupon:', error)
      }
    }
  }

  return (
    <div className="admin-content-container">
      <h1>Coupon Management</h1>

      <div className="create-form">
        <h2>Create New Coupon</h2>
        <form onSubmit={handleCreateCoupon}>
          <div className="form-group">
            <label htmlFor="code">Coupon Code</label>
            <input
              type="text"
              id="code"
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
              required
              placeholder="Enter coupon code"
            />
          </div>

          <div className="form-group">
            <label htmlFor="discount">Discount (%)</label>
            <input
              type="number"
              id="discount"
              value={newCoupon.discount}
              onChange={(e) => setNewCoupon({ ...newCoupon, discount: Number(e.target.value) })}
              required
              min="0"
              max="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="expires_at">Expiry Date</label>
            <input
              type="date"
              id="expires_at"
              value={newCoupon.expires_at}
              onChange={(e) => setNewCoupon({ ...newCoupon, expires_at: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="create-button">Create Coupon</button>
        </form>
      </div>

      <div className="items-list">
        <h2>Active Coupons</h2>
        {loading ? (
          <div className="loading">Loading coupons...</div>
        ) : (
          <div className="items-grid">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="item-card">
                <div className="item-header">
                  <h3>{coupon.code}</h3>
                  <button
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
                <div className="item-details">
                  <p>Discount: {coupon.discount}%</p>
                  <p>Expires: {new Date(coupon.expires_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}