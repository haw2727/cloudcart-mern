import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import { useCart } from '../context/CartContext'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true)
      const data = await productService.getProduct(id)
      setProduct(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  if (loading) return <div className="loading">Loading product...</div>
  if (error) return <div className="error">Error: {error}</div>
  if (!product) return <div className="error">Product not found</div>

  return (
    <div className="product-detail">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
        <div className="product-detail-content">
          <div className="product-image-large">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-details">
            <h1>{product.name}</h1>
            <p className="product-category">{product.category}</p>
            <div className="product-price">${product.price}</div>
            <p className="product-description">{product.description}</p>
            <p className="product-stock">Stock: {product.stock}</p>
            <button 
              className="add-to-cart"
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail