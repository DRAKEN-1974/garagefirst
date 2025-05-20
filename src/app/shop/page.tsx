'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './shop.module.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface Product {
  id: string
  name: string
  description: string
  price: number
  coin_cost: number
  stock_quantity: number
  category: string
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [coinBalance, setCoinBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [sortBy, setSortBy] = useState('price')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: workerCoins, error: coinsError } = await supabase
        .from('worker_coins')
        .select('balance')
        .eq('worker_id', user.id)
        .maybeSingle()

      if (coinsError) throw coinsError
      setCoinBalance(workerCoins?.balance || 0)

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (productsError) throw productsError
      setProducts(productsData || [])
      
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (product: Product) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      if (product.coin_cost > coinBalance) {
        throw new Error('Insufficient coins')
      }

      if (product.stock_quantity <= 0) {
        throw new Error('Product out of stock')
      }

      const { error: purchaseError } = await supabase.rpc('purchase_product', {
        product_id: product.id,
        user_id: user.id,
        coins_spent: product.coin_cost
      })

      if (purchaseError) throw purchaseError
      await fetchData()
      
    } catch (error: any) {
      setError(error.message)
    }
  }

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1
      if (sortBy === 'price') {
        return (a.price - b.price) * multiplier
      }
      return (a.coin_cost - b.coin_cost) * multiplier
    })

  const categories = ['All Categories', ...new Set(products.map(p => p.category))]

  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.shopContainer}>
          <div className={styles.heroSection}>
            <h1>Shop Premium Tools</h1>
            <div className={styles.coinDisplay}>
              <span className={styles.coinIcon}>💰</span>
              <span className={styles.coinBalance}>{coinBalance}</span>
              <span className={styles.coinLabel}>COINS</span>
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.controls}>
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.filterSort}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="price">Sort by Price</option>
                <option value="coin_cost">Sort by Coins</option>
              </select>

              <button
                onClick={() => setSortDirection(d => d === 'asc' ? 'desc' : 'asc')}
                className={styles.sortButton}
              >
                {sortDirection === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          <div className={styles.productGrid}>
            {filteredProducts.map(product => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productContent}>
                  <h2>{product.name}</h2>
                  <p>{product.description}</p>
                  <div className={styles.productMeta}>
                    <div className={styles.pricing}>
                      <span className={styles.price}>${product.price}</span>
                      <span className={styles.coins}>{product.coin_cost} COINS</span>
                    </div>
                    <div className={styles.stock}>
                      {product.stock_quantity > 0 ? (
                        <span className={styles.inStock}>
                          {product.stock_quantity} in stock
                        </span>
                      ) : (
                        <span className={styles.outOfStock}>
                          Out of stock
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handlePurchase(product)}
                    disabled={product.stock_quantity <= 0 || product.coin_cost > coinBalance}
                    className={styles.purchaseButton}
                  >
                    {product.stock_quantity <= 0 ? 'Out of Stock' :
                     product.coin_cost > coinBalance ? 'Insufficient Coins' :
                     'Purchase Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}