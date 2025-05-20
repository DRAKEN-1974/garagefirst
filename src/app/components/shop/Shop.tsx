interface Product {
  id: number
  name: string
  category: string
  price: number
  image: string
  description: string
}

// Mock data - will be replaced with Supabase data later
const products: Product[] = [
  {
    id: 1,
    name: "High Performance Oil Filter",
    category: "Engine Parts",
    price: 29.99,
    image: "/products/oil-filter.jpg",
    description: "Premium quality oil filter for optimal engine protection"
  },
  // Add more products...
]

interface ShopGridProps {
  category: string
  searchQuery: string
}

export default function ShopGrid({ category, searchQuery }: ShopGridProps) {
  const filteredProducts = products.filter(product => {
    const matchesCategory = category === 'All' || product.category === category
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="shop-grid">
      {filteredProducts.map((product) => (
        <div key={product.id} className="product-card">
          <div className="product-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-info">
            <h3>{product.name}</h3>
            <p className="product-category">{product.category}</p>
            <p className="product-description">{product.description}</p>
            <div className="product-footer">
              <span className="price">${product.price.toFixed(2)}</span>
              <button className="add-to-cart">Add to Cart</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}