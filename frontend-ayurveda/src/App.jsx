import { useState, useEffect } from 'react';
import { api } from './services/api';
import './App.css'

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginTop: '2px', color: '#333'}}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
)
// This is a test branch change
const CartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '5px'}}>
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
)

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '5px'}}>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
)

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState([])
  const [currentView, setCurrentView] = useState('grid')
  
  // Interactive UI State
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showDeals, setShowDeals] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(localStorage.getItem('jwt_token') || null)
  
  const [productDetails, setProductDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

    const fetchProducts = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await api.getProducts();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch products", err);
      if (err.message === "Unauthorized") {
        setToken(null);
        localStorage.removeItem('jwt_token');
      }
      setLoading(false);
    }
  })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch products", err)
        if (err.message === "Unauthorized") {
          setToken(null);
          localStorage.removeItem('jwt_token');
        }
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchProducts();
  }, [token])

  const handleAddToCart = (product) => {
    setCartItems(prev => [...prev, product])
  }

  const handleRemoveFromCart = (indexToRemove) => {
    setCartItems(prev => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleProductClick = (id) => {
    setCurrentView('details')
    setLoadingDetails(true)
    
    const product = products.find(p => p.id === id)
    if (product) {
      setProductDetails(product)
      setLoadingDetails(false)
    } else {
      setLoadingDetails(false)
    }
  }

  const handlePlaceOrder = () => {
    const orderData = {
      totalAmount: finalTotalAmount,
      itemCount: cartItems.length,
      status: 'CONFIRMED'
    };

        api.placeOrder(orderData)
    .then(data => {
      alert(`Order #` + data.id + ` placed successfully! Thank you.`);
      setCartItems([]);
      setCurrentView('grid');
    })
    .catch(err => {
      console.error("Order error", err);
      alert('Order failed! Are you logged in?');
    });
  }

    const handleAuth = async () => {
    try {
      if (isRegister) {
        await api.register(email, password);
        alert("Registration Successful! You can now log in.");
        setIsRegister(false);
      } else {
        const data = await api.login(email, password);
        if (data.token) {
          localStorage.setItem('jwt_token', data.token);
          setToken(data.token);
          setIsLoginOpen(false);
          alert("Login Successful! Welcome back.");
        }
      }
    } catch (err) {
      alert("Authentication Failed! Please check your credentials.");
    }
  }

  // Interactive Handlers
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
    setShowDeals(false)
    setCurrentView('grid')
  }

  const handleDealsClick = () => {
    setShowDeals(true)
    setSelectedCategory('All')
    setCurrentView('grid')
  }

  const handleHomeClick = () => {
    setShowDeals(false)
    setSelectedCategory('All')
    setCurrentView('grid')
  }

  const handleSupportClick = () => {
    alert("Welcome to Ayurveda Marketplace Support! \n\nCall us: 1-800-AYURVEDA \nEmail: support@ayurvedamarketplace.com \nWorking Hours: 9 AM to 6 PM")
  }

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('jwt_token');
    setProducts([]);
    setCartItems([]);
  }

  // Derived Values
  const totalOriginalPrice = cartItems.reduce((sum, item) => sum + (item.originalPrice || 0), 0)
  const totalDiscountPrice = cartItems.reduce((sum, item) => sum + (item.discountPrice || 0), 0)
  const totalDiscount = totalOriginalPrice - totalDiscountPrice
  const platformFee = cartItems.length > 0 ? 50 : 0
  const finalTotalAmount = totalDiscountPrice + platformFee

  // Grid Filtering Logic
  let displayedProducts = products;
  if (showDeals) {
    // Show products where discount is 20% or more
    displayedProducts = displayedProducts.filter(p => {
      const discountPercent = ((p.originalPrice - p.discountPrice) / p.originalPrice) * 100;
      return discountPercent >= 20;
    });
  } else if (selectedCategory !== 'All') {
    displayedProducts = displayedProducts.filter(p => p.category === selectedCategory);
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-brand" onClick={handleHomeClick}>
          <span style={{color: '#febd69', fontWeight: 'bold', fontSize: '1.2rem', marginRight: '5px'}}>AM</span>
          Ayurveda Marketplace
        </div>
        <div className="nav-search">
          <select className="search-category" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="All">All</option>
            <option value="Churnas">Churnas</option>
            <option value="Oils">Oils</option>
            <option value="Skincare">Skincare</option>
            <option value="Supplements">Supplements</option>
          </select>
          <input type="text" placeholder="Search for holistic products..." />
          <button className="search-btn"><SearchIcon /></button>
        </div>
        <div className="nav-links">
          
          <button className="btn-nav" onClick={() => token ? handleLogout() : setIsLoginOpen(true)} style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
            <UserIcon />
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
              <span style={{fontSize: '0.85rem'}}>{token ? 'Sign Out' : 'Sign In'}</span>
              <b>Accounts & Lists</b>
            </div>
          </button>
          
          <button className="btn-nav" onClick={() => alert('You have no recent orders. Start shopping today!')}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
              <span style={{fontSize: '0.85rem'}}>Returns</span>
              <b>& Orders</b>
            </div>
          </button>

          <button className="btn-cart" onClick={() => setCurrentView('cart')}>
            <CartIcon />
            <span className="cart-count">{cartItems.length}</span>
            <b>Cart</b>
          </button>
        </div>
      </nav>

      <div className="sub-nav">
        <span style={{display: 'flex', alignItems: 'center'}} onClick={handleHomeClick}><MenuIcon /> All</span>
        <span onClick={handleHomeClick}>Home</span>
        <span onClick={handleDealsClick}>Today's Deals</span>
        <span onClick={handleSupportClick}>Customer Service</span>
      </div>

      <main className="main-content">
        {!token ? (
           <div style={{padding: '50px', textAlign: 'center', fontSize: '1.2rem'}}>
             Please <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginOpen(true); }} style={{color: '#c45500'}}>Sign In</a> to view products.
           </div>
        ) : currentView === 'grid' && (
          <>
            <div className="hero-banner">
              <h2>Discover Authentic Ayurvedic Wellness</h2>
              <p>Shop 100% organic herbs, oils, and traditional remedies.</p>
            </div>
            
            <div className="results-info" style={{display: 'flex', justifyContent: 'space-between'}}>
              <span>
                {displayedProducts.length} results for 
                <b> {showDeals ? "Today`'s Deals" : `"${selectedCategory === 'All' ? 'Ayurvedic Products' : selectedCategory}"`}</b>
              </span>
              {showDeals && <span style={{color: '#cc0c39', fontWeight: 'bold'}}>Showing products with 20% or more discount!</span>}
            </div>
            
            {loading ? (
              <div style={{padding: '50px', textAlign: 'center', fontSize: '1.2rem'}}>Loading database products...</div>
            ) : displayedProducts.length === 0 ? (
              <div style={{padding: '50px', textAlign: 'center', fontSize: '1.2rem'}}>No products found in this category.</div>
            ) : (
              <div className="product-grid">
                {displayedProducts.map(product => {
                  const discountPercent = Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100);
                  return (
                    <div key={product.id} className="product-card">
                      <div className="product-image-container" onClick={() => handleProductClick(product.id)} style={{cursor: 'pointer'}}>
                        <img src={product.imageUrl} alt={product.title} className="product-image" />
                      </div>
                      <div className="product-details-short">
                        <h4 className="product-name" onClick={() => handleProductClick(product.id)}>{product.title}</h4>
                        <div className="rating-container">
                          <span className="stars">?????</span>
                          <span className="rating-number">? 1245</span>
                        </div>
                        <div className="pricing-section">
                          <div className="discount-badge">-{discountPercent}%</div>
                          <div className="final-price">
                            <span className="currency">?</span>
                            <span className="whole">{Math.floor(product.discountPrice)}</span>
                            <span className="fraction">{(product.discountPrice % 1).toFixed(2).substring(1)}</span>
                          </div>
                        </div>
                        <div className="original-price">
                          Typical price: <span className="strikethrough">?{product.originalPrice.toFixed(2)}</span>
                        </div>
                        <button className="btn-add-cart" onClick={() => handleAddToCart(product)}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {token && currentView === 'details' && (
          <div className="product-details-page">
             <button className="back-btn" onClick={() => setCurrentView('grid')}>? Back to results</button>
             {loadingDetails || !productDetails ? (
               <div style={{padding: '50px', textAlign: 'center'}}>Loading live data from Spring Boot API...</div>
             ) : (
               <div className="details-layout">
                  <div className="details-image-section">
                    <img src={productDetails.imageUrl} alt={productDetails.title} className="details-large-image" />
                  </div>
                  <div className="details-info-section">
                    <h1 className="details-title">{productDetails.title}</h1>
                    <a href="#">Visit the Ayurveda Store</a>
                    <div className="rating-container" style={{margin: '10px 0'}}>
                      <span className="stars">?????</span>
                      <span className="rating-number">? 342 ratings</span>
                    </div>
                    <hr className="divider" />
                    
                    <div className="pricing-section" style={{margin: '15px 0'}}>
                      <div className="final-price" style={{fontSize: '2rem'}}>
                        <span className="currency">?</span>
                        <span className="whole">{Math.floor(productDetails.discountPrice)}</span>
                        <span className="fraction">{(productDetails.discountPrice % 1).toFixed(2).substring(1)}</span>
                      </div>
                    </div>
                    <p>Typical Price: <strong className="strikethrough">?{productDetails.originalPrice.toFixed(2)}</strong></p>
                    <p><strong>Ingredients:</strong> 100% Organic Extracts, Cold Pressed Oils.</p>
                    
                    <hr className="divider" />
                    <h3>About this item</h3>
                    <ul className="details-bullets">
                      <li>Authentic Ayurvedic product carefully sourced and prepared.</li>
                      <li>Sourced directly from authentic Ayurvedic farms.</li>
                      <li>No artificial chemicals or preservatives.</li>
                    </ul>
                  </div>
                  <div className="details-buy-box">
                    <h2 className="buy-box-price">?{productDetails.discountPrice?.toFixed(2)}</h2>
                    <div className="prime-badge" style={{marginBottom: '10px'}}>
                        ? <b>Prime</b> One-Day
                    </div>
                    <p className="delivery-text" style={{color: 'green'}}>In Stock.</p>
                    <button className="btn-add-cart" onClick={() => handleAddToCart(productDetails)}>
                      Add to Cart
                    </button>
                    <button className="btn-buy-now">
                      Buy Now
                    </button>
                  </div>
               </div>
             )}
          </div>
        )}

        {token && currentView === 'cart' && (
          <div className="cart-page-layout">
            
            {/* Left Column: Cart Items */}
            <div className="cart-left-section">
              <div className="cart-items-container">
                {cartItems.length === 0 ? (
                  <div style={{padding: '40px', textAlign: 'center'}}>
                    <h3>Your cart is empty!</h3>
                    <button className="btn-add-cart" style={{width: '200px'}} onClick={() => setCurrentView('grid')}>Continue Shopping</button>
                  </div>
                ) : (
                  <>
                    <h2 style={{padding: '20px', margin: 0, borderBottom: '1px solid #ddd'}}>Shopping Cart</h2>
                    {cartItems.map((item, index) => (
                      <div key={index} className="cart-item-row">
                        <div className="cart-item-image">
                          <img src={item.imageUrl} alt={item.title} />
                          <div className="qty-controls">
                            <button className="qty-btn">�</button>
                            <input type="text" value="1" readOnly className="qty-input" />
                            <button className="qty-btn">+</button>
                          </div>
                        </div>
                        
                        <div className="cart-item-details">
                          <h4 className="cart-item-title">{item.title}</h4>
                          <div style={{color: '#007600', fontSize: '0.9rem', marginBottom: '5px'}}>In Stock</div>
                          <div className="cart-item-price-row">
                            <span className="final">?{item.discountPrice.toFixed(2)}</span>
                          </div>
                          <div className="cart-item-actions">
                            <span onClick={() => handleRemoveFromCart(index)}>Delete</span>
                            <span>Save for later</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="cart-place-order-bar">
                      <button className="btn-place-order" onClick={handlePlaceOrder}>Proceed to Checkout</button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Column: Price Details */}
            <div className="cart-right-section">
              <div className="price-header">Order Summary</div>
              <div className="price-row">
                <span>Items ({cartItems.length}):</span>
                <span>?{totalOriginalPrice.toFixed(2)}</span>
              </div>
              <div className="price-row discount-row">
                <span>Discount:</span>
                <span>-?{totalDiscount.toFixed(2)}</span>
              </div>
              <div className="price-total-row">
                <span>Order Total:</span>
                <span style={{color: '#b12704'}}>?{cartItems.length > 0 ? finalTotalAmount.toFixed(2) : '0.00'}</span>
              </div>
              {cartItems.length > 0 && (
                <div className="savings-msg">
                  Your total savings is ?{totalDiscount.toFixed(2)}!
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      {/* Login Modal Overlay */}
      {isLoginOpen && (
        <div className="modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isRegister ? 'Register' : 'Sign in'}</h2>
              <button className="close-btn" onClick={() => setIsLoginOpen(false)}>?</button>
            </div>
            <div className="form-group">
              <label>Email address</label>
              <input type="text" className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button className="btn-primary" onClick={handleAuth}>
              {isRegister ? 'Register' : 'Continue'}
            </button>
            <p style={{fontSize: '0.85rem', marginTop: '20px', cursor: 'pointer', color: '#0066c0'}} onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'Already have an account? Sign in' : 'New to Ayurveda Marketplace? Create your account'}
            </p>
          </div>
        </div>
      )}

    </div>
  )
}

export default App





