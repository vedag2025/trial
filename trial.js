import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, Search, LocateFixed, Star, StarHalf, Menu, X, Volume2, Filter, LogIn, UserPlus, LogOut, Minus, Plus, Trash2, CheckCircle } from 'lucide-react';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// -------------------------------------------------------------------------
// Helper Functions & Data
// -------------------------------------------------------------------------

const products = [
  { id: 'ramen-1', name: 'Spicy Kimchi Ramen', price: 149, images: ['https://placehold.co/400x300/F5F5DC/800000?text=Spicy+Kimchi+Ramen', 'https://placehold.co/400x300/E8E8D5/800000?text=Kimchi+Bowl'], rating: 4.5, type: 'ramen' },
  { id: 'skincare-1', name: 'Hydrating Snail Mucin Serum', price: 1299, images: ['https://placehold.co/400x300/E5E5E5/800000?text=Snail+Serum+Bottle', 'https://placehold.co/400x300/F0F0F0/800000?text=Glowing+Skin+Effect'], rating: 5, type: 'skincare', discount: true, delivery: 'free-shipping' },
  { id: 'skincare-2', name: 'Korean Charcoal Sheet Mask', price: 99, images: ['https://placehold.co/400x300/F5F5DC/800000?text=Charcoal+Sheet+Mask'], rating: 4, type: 'skincare' },
  { id: 'ramen-2', name: 'Bulgogi Flavor Noodles', price: 159, images: ['https://placehold.co/400x300/F0F0F0/800000?text=Bulgogi+Noodle+Pack', 'https://placehold.co/400x300/E5E5E5/800000?text=Rich+Bulgogi+Flavor'], rating: 4.5, type: 'ramen', discount: true, delivery: 'free-shipping' },
  { id: 'skincare-3', name: 'Green Tea Cleansing Foam', price: 450, images: ['https://placehold.co/400x300/F5F5DC/800000?text=Green+Tea+Cleanser'], rating: 5, type: 'skincare' },
  { id: 'ramen-3', name: 'Sweet Red Bean Ramen', price: 130, images: ['https://placehold.co/400x300/E8E8D5/800000?text=Sweet+Red+Bean+Ramen'], rating: 4.5, type: 'ramen' },
  { id: 'kitchen-1', name: 'Samgyupsal Grill Pan', price: 2500, images: ['https://placehold.co/400x300/F0F0F0/800000?text=Samgyupsal+Grill+Pan'], rating: 4, type: 'kitchen' },
  { id: 'skincare-4', name: 'Aloe Vera Soothing Gel', price: 550, images: ['https://placehold.co/400x300/E5E5E5/800000?text=Aloe+Vera+Soothing+Gel'], rating: 4.5, type: 'skincare' },
  { id: 'ramen-4', name: 'Tteokbokki Rice Cakes', price: 250, images: ['https://placehold.co/400x300/F5F5DC/800000?text=Tteokbokki+Rice+Cakes'], rating: 5, type: 'ramen', delivery: 'free-shipping' },
  { id: 'other-1', name: 'Korean Soju', price: 800, images: ['https://placehold.co/400x300/E8E8D5/800000?text=Classic+Soju+Bottle'], rating: 4.5, type: 'other', discount: true },
];

const testimonials = [
  { text: 'The ramen is delicious and the skincare leaves my skin glowing. A great mix of products!', author: 'Priya S.', image: 'https://placehold.co/100x100/F5F5DC/800000?text=PS' },
  { text: 'Finally, authentic Korean noodles and skincare that are easy to get. The quality is unmatched.', author: 'Rajesh K.', image: 'https://placehold.co/100x100/800000/F5F5DC?text=RK' },
  { text: 'The skincare products are a lifesaver. So effective and incredibly good for my skin.', author: 'Anjali V.', image: 'https://placehold.co/100x100/F5F5DC/800000?text=AV' },
];

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={i} size={16} fill="#FFD700" stroke="#FFD700" />);
  }
  if (hasHalfStar) {
    stars.push(<StarHalf key="half" size={16} fill="#FFD700" stroke="#FFD700" />);
  }
  while (stars.length < 5) {
    stars.push(<Star key={stars.length} size={16} stroke="#FFD700" />);
  }
  return stars;
};

const base64ToArrayBuffer = (base64) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const pcmToWav = (pcmData, sampleRate) => {
  const numSamples = pcmData.length;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);
  let offset = 0;

  const writeString = (str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset++, str.charCodeAt(i));
    }
  };

  writeString('RIFF');
  view.setUint32(offset, 36 + numSamples * 2, true);
  offset += 4;
  writeString('WAVE');
  writeString('fmt ');
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint32(offset, sampleRate, true);
  offset += 4;
  view.setUint32(offset, sampleRate * 2, true);
  offset += 4;
  view.setUint16(offset, 2, true);
  offset += 2;
  view.setUint16(offset, 16, true);
  offset += 2;
  writeString('data');
  view.setUint32(offset, numSamples * 2, true);
  offset += 4;

  for (let i = 0; i < numSamples; i++) {
    view.setInt16(offset, pcmData[i], true);
    offset += 2;
  }

  return new Blob([view], { type: 'audio/wav' });
};


// -------------------------------------------------------------------------
// Page Components
// -------------------------------------------------------------------------

const HomePage = ({ navigateToPage, generateFestiveMessage, isGeneratingMessage, generatedMessage, generateFestiveRecipe, isGeneratingFestiveRecipe, generatedFestiveRecipe }) => (
  <>
    {/* Hero Section */}
    <section id="hero" className="py-20 lg:py-32 relative overflow-hidden bg-cover bg-center font-serif"
             style={{ backgroundImage: `url('uploaded:Background.jpg-c12bc6f3-9413-4595-8c61-0f4058c5ac25')` }}>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
            The Fusion of Soul & Flavor
          </h1>
          <p className="text-lg text-gray-200 mt-4 max-w-xl mx-auto md:mx-0">
            Bringing the rich, authentic tastes of Korea and the timeless wisdom of Ayurveda together for your well-being.
          </p>
          <button onClick={() => navigateToPage('products')} className="px-8 py-4 bg-[#FFB500] text-black text-lg font-bold rounded-full hover:bg-[#E6A200] transition-colors shadow-xl mt-8">
            DISCOVER NOW
          </button>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
          <img src="uploaded:image_4ba720.png-111dd8ea-7acb-41ba-8b26-ec4722287a1c" alt="SeoulVeda products" className="rounded-3xl shadow-2xl" />
        </div>
      </div>
    </section>

    {/* Fusion Section */}
    <section className="bg-[#FFF8E1] py-20 md:py-28 font-serif">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#9C271A] leading-tight">
            A Curated Collection of Korea's Finest
          </h2>
          <p className="text-lg text-gray-700 mt-4">
            We source the most authentic flavors and effective beauty secrets from Seoul. From soothing ginseng to spicy kimchi, our products are a testament to quality and tradition.
          </p>
          <button className="mt-8 px-8 py-4 bg-[#9C271A] text-white text-lg font-bold rounded-full hover:bg-[#7D1E16] transition-colors shadow-lg"
                  onClick={generateFestiveMessage}
                  disabled={isGeneratingMessage}
          >
            {isGeneratingMessage ? 'Generating...' : 'Get a Message ✨'}
          </button>
          {generatedMessage && (
            <div className="mt-4 p-4 bg-white rounded-lg text-left text-sm text-gray-700 max-w-xl mx-auto md:mx-0">
              <p className="font-semibold mb-2">Social Media Message:</p>
              <p>{generatedMessage}</p>
            </div>
          )}
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img src="https://placehold.co/400x300/9C271A/FFF8E1?text=Skincare+and+Ramen+Fusion" alt="Fusion dish" className="rounded-3xl shadow-xl" />
        </div>
      </div>
    </section>

    {/* Celebrate with Us Section (New) */}
    <section className="bg-[#FFB500] py-20 md:py-28 text-[#9C271A] font-serif">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
            Celebrate with a Taste of Fusion
          </h2>
          <p className="text-lg text-gray-800 mt-4">
            Discover festive flavors that blend the best of Indian and Korean traditions. From a Gochujang Biryani to a Kimchi Pakora, our recipes are designed for celebration.
          </p>
          <button
            className="mt-8 px-8 py-4 bg-white text-[#9C271A] text-lg font-bold rounded-full hover:bg-gray-200 transition-colors shadow-lg"
            onClick={generateFestiveRecipe}
            disabled={isGeneratingFestiveRecipe}
          >
            {isGeneratingFestiveRecipe ? 'Generating...' : 'Get a Festive Recipe ✨'}
          </button>
          {generatedFestiveRecipe && (
            <div className="mt-4 p-4 bg-white rounded-lg text-left text-sm text-gray-700 max-w-xl mx-auto md:mx-0">
              <p className="font-semibold mb-2">Festive Recipe Idea:</p>
              <p>{generatedFestiveRecipe}</p>
            </div>
          )}
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img src="https://placehold.co/400x300/FADBD8/FFB500?text=Festive+Fusion+Food" alt="Festive fusion food" className="rounded-3xl shadow-xl" />
        </div>
      </div>
    </section>

    {/* Our Village Section */}
    <section className="bg-[#9C271A] py-20 md:py-28 text-white relative font-serif">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
          Honoring Tradition, Creating the Future
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
          <div className="flex flex-col items-center text-center">
            <img src="https://placehold.co/150x150/FFF8E1/9C271A?text=Natural" alt="Natural Ingredients" className="rounded-full shadow-lg mb-4" />
            <h3 className="text-xl font-semibold">Natural Ingredients</h3>
            <p className="text-sm text-gray-200 mt-2">
              Respect for ancient practices meets modern innovations for the purest products.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <img src="https://placehold.co/150x150/FFF8E1/9C271A?text=Flavors" alt="Ramen Delights" className="rounded-full shadow-lg mb-4" />
            <h3 className="text-xl font-semibold">Authentic Flavors</h3>
            <p className="text-sm text-gray-200 mt-2">
              Nutritious and delicious noodles with authentic, traditional flavors.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <img src="https://placehold.co/150x150/FFF8E1/9C271A?text=Glow" alt="Skincare Essentials" className="rounded-full shadow-lg mb-4" />
            <h3 className="text-xl font-semibold">Skincare Essentials</h3>
            <p className="text-sm text-gray-200 mt-2">
              Bringing you the best of K-Beauty for a radiant, healthy glow.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <img src="https://placehold.co/150x150/FFF8E1/9C271A?text=Innovation" alt="Constant Innovation" className="rounded-full shadow-lg mb-4" />
            <h3 className="text-xl font-semibold">Constant Innovation</h3>
            <p className="text-sm text-gray-200 mt-2">
              Constantly sourcing and creating the best products for your modern lifestyle.
            </p>
          </div>
        </div>
      </div>
    </section>
  </>
);

const ProductsPage = ({ addToCart, generateContent, isGenerating }) => {
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('none');
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [generatedContent, setGeneratedContent] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndexes => {
        const newIndexes = { ...prevIndexes };
        products.forEach((product, index) => {
          if (product.images.length > 1) {
            const current = newIndexes[index] || 0;
            newIndexes[index] = (current + 1) % product.images.length;
          }
        });
        return newIndexes;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleGenerateContent = async (productName, productId, contentType) => {
    const text = await generateContent(productName, contentType);
    if (text) {
      setGeneratedContent(prev => ({ ...prev, [productId]: text }));
    }
  };
  
  const filteredProducts = products.filter(product => {
    if (category !== 'all' && product.type !== category) return false;
    if (freeDelivery && product.delivery !== 'free-shipping') return false;
    return true;
  }).sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'rating-desc') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="container mx-auto px-4 py-8 font-sans">
      <h2 className="text-4xl font-bold text-center mb-10 text-[#9C271A]">Our Products</h2>
      {/* Filter and Sort Section */}
      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mb-8 p-4 bg-[#FFF8E1] rounded-2xl shadow-inner">
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-600" />
          <span className="font-semibold text-gray-700">Filter:</span>
        </div>
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9C271A] transition-all"
        >
          <option value="all">All Categories</option>
          <option value="ramen">Ramen</option>
          <option value="skincare">Skincare</option>
          <option value="kitchen">Kitchenware</option>
          <option value="other">Other</option>
        </select>
        <div className="flex items-center space-x-2">
          <Search size={20} className="text-gray-600" />
          <span className="font-semibold text-gray-700">Sort:</span>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-2 border border-gray-300 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9C271A] transition-all"
        >
          <option value="none">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Rating: High to Low</option>
        </select>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={freeDelivery}
            onChange={(e) => setFreeDelivery(e.target.checked)}
            className="form-checkbox h-5 w-5 text-[#9C271A] rounded-full focus:ring-offset-0 transition-all"
          />
          <span className="text-gray-800 font-medium">Free Delivery</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product, index) => (
          <div key={product.id} className="bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <img
              src={product.images[currentImageIndex[index] || 0]}
              alt={product.name}
              className="w-full h-48 object-cover object-center"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/FFF8E1/9C271A?text=Image+Not+Found"; }}
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-[#9C271A]">{product.name}</h3>
                <div className="flex-shrink-0">
                  {product.discount && <span className="inline-block bg-[#FFB500] text-black text-xs font-bold px-2 py-1 rounded-full uppercase">Sale</span>}
                </div>
              </div>
              <div className="flex items-center space-x-1 text-[#FFB500] mb-2">
                {renderStars(product.rating)}
                <span className="text-sm text-gray-500">({product.rating})</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-2xl font-bold text-[#9C271A]">₹{product.price}</p>
                <button onClick={() => addToCart(product)} className="flex items-center space-x-2 bg-[#9C271A] text-white px-4 py-2 rounded-full hover:bg-black transition-colors shadow-md">
                  <ShoppingCart size={18} />
                  <span className="font-semibold">Add to Cart</span>
                </button>
              </div>
              <div className="mt-4">
                {product.type === 'ramen' ? (
                  <button
                    onClick={() => handleGenerateContent(product.name, product.id, 'recipe')}
                    className="w-full text-center text-sm text-[#9C271A] font-semibold py-2 rounded-full hover:bg-red-50 transition-colors border border-[#9C271A]"
                    disabled={isGenerating}
                  >
                    {isGenerating ? 'Generating...' : `Generate a Recipe`}
                  </button>
                ) : product.type === 'skincare' ? (
                  <button
                    onClick={() => handleGenerateContent(product.name, product.id, 'skincare-routine')}
                    className="w-full text-center text-sm text-[#9C271A] font-semibold py-2 rounded-full hover:bg-red-50 transition-colors border border-[#9C271A]"
                    disabled={isGenerating}
                  >
                    {isGenerating ? 'Generating...' : `Get a Skincare Routine`}
                  </button>
                ) : null}
                {generatedContent[product.id] && (
                  <div className="mt-4 p-4 text-sm bg-gray-50 rounded-lg">
                    <p className="font-semibold mb-2">{product.type === 'ramen' ? 'Recipe Idea:' : 'Skincare Routine:'}</p>
                    <p>{generatedContent[product.id]}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CartPage = ({ cart, totalItems, calculateTotal, updateQuantity, removeFromCart, handleCheckout, isCheckoutOpen, setIsCheckoutOpen, checkoutMessage, setCheckoutMessage, navigateToPage }) => (
  <div className="container mx-auto px-4 py-8 min-h-screen font-sans">
    <h2 className="text-4xl font-bold text-center mb-10 text-[#9C271A]">Your Cart</h2>
    {cart.length === 0 ? (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-md">
        <p className="text-xl text-gray-600 font-semibold mb-4">Your cart is empty.</p>
        <button onClick={() => navigateToPage('products')} className="px-6 py-3 bg-[#9C271A] text-white font-bold rounded-full hover:bg-[#7D1E16] transition-colors shadow-lg">
          Start Shopping
        </button>
      </div>
    ) : (
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl p-6 md:p-8">
          <h3 className="text-2xl font-semibold mb-6">Items ({totalItems})</h3>
          <ul className="space-y-6">
            {cart.map(item => (
              <li key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 border-b border-gray-200 last:border-b-0">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl shadow-sm flex-shrink-0"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/FFF8E1/9C271A?text=Image+Not+Found"; }}
                />
                <div className="flex-grow">
                  <h4 className="text-lg font-semibold text-[#9C271A]">{item.name}</h4>
                  <p className="text-gray-600 mt-1">₹{item.price}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-gray-100 rounded-full p-1">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
                      <Minus size={16} />
                    </button>
                    <span className="px-4 font-medium text-lg">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Order Summary & Checkout */}
        <div className="lg:w-1/3 bg-white rounded-3xl shadow-xl p-6 md:p-8 flex flex-col items-center">
          <h3 className="text-2xl font-semibold mb-6">Order Summary</h3>
          <div className="w-full space-y-4 text-gray-700">
            <div className="flex justify-between font-medium">
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="h-px bg-gray-200 my-4"></div>
            <div className="flex justify-between text-xl font-bold text-[#9C271A]">
              <span>Total</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="mt-8 w-full px-8 py-4 bg-[#FFB500] text-black text-lg font-bold rounded-full hover:bg-[#E6A200] transition-colors shadow-lg"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    )}
    
    {/* Checkout Modal */}
    {isCheckoutOpen && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl relative">
          <button onClick={() => { setIsCheckoutOpen(false); setCheckoutMessage(''); }} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
          <h3 className="text-3xl font-bold text-[#9C271A] mb-4">Checkout</h3>
          <p className="text-gray-600 mb-6">Your total is <span className="font-bold text-[#9C271A]">₹{calculateTotal().toFixed(2)}</span>. Please confirm your order.</p>
          {checkoutMessage && (
            <div className={`p-4 rounded-xl mb-4 ${checkoutMessage.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              <p className="font-medium flex items-center justify-center gap-2">
                {checkoutMessage.includes('successful') && <CheckCircle size={20} />}
                {checkoutMessage}
              </p>
            </div>
          )}
          <button
            onClick={handleCheckout}
            className="mt-4 w-full px-8 py-4 bg-[#9C271A] text-white text-lg font-bold rounded-full hover:bg-[#7D1E16] transition-colors shadow-lg"
            disabled={checkoutMessage.includes('Processing')}
          >
            {checkoutMessage.includes('Processing') ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    )}
  </div>
);

const ProfilePage = ({ user, userProfile, handleProfileChange, handleSignOut, saveProfile, isSavingProfile, profileMessage, handleSignUp, handleSignIn, authError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      handleSignUp(email, password);
    } else {
      handleSignIn(email, password);
    }
  };

  if (user && !user.isAnonymous) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center font-sans">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 w-full max-w-2xl">
          <div className="flex flex-col items-center mb-6">
            <User size={64} className="text-[#9C271A] mb-4" />
            <h2 className="text-4xl font-bold text-[#9C271A]">My Profile</h2>
            <p className="text-sm text-gray-500 mt-2">User ID: {user.uid}</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); saveProfile(); }}>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={userProfile.name || ''}
                  onChange={handleProfileChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C271A] transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={userProfile.address || ''}
                  onChange={handleProfileChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C271A] transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={userProfile.phone || ''}
                  onChange={handleProfileChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C271A] transition-all"
                />
              </div>
              <div className="flex justify-between items-center space-x-4">
                <button type="submit" className="flex-1 px-8 py-3 bg-[#9C271A] text-white font-bold rounded-full hover:bg-[#7D1E16] transition-colors shadow-lg" disabled={isSavingProfile}>
                  {isSavingProfile ? 'Saving...' : 'Save Profile'}
                </button>
                <button type="button" onClick={handleSignOut} className="flex-1 px-8 py-3 border border-[#E74C3C] text-[#E74C3C] font-bold rounded-full hover:bg-[#FADBD8] transition-colors shadow-lg">
                  Sign Out
                </button>
              </div>
            </div>
          </form>
          {profileMessage && <p className="mt-4 text-center text-sm font-medium text-green-600">{profileMessage}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center font-sans">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <User size={64} className="text-[#9C271A]" />
        </div>
        <h2 className="text-3xl font-bold text-[#9C271A] mb-4">
          {isSignUp ? 'Create an Account' : 'Sign In'}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {isSignUp ? 'Sign up to save your cart and profile.' : 'Sign in to access your profile.'}
        </p>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#9C271A] transition-all"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#9C271A] transition-all"
            />
          </div>
          {authError && <p className="text-red-500 text-sm mt-2">{authError}</p>}
          <button
            type="submit"
            className="w-full px-8 py-3 bg-[#9C271A] text-white font-bold rounded-full hover:bg-[#7D1E16] transition-colors shadow-lg"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <button onClick={() => setIsSignUp(!isSignUp)} className="mt-4 text-[#9C271A] hover:underline transition-colors text-sm">
          {isSignUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}
        </button>
      </div>
    </div>
  );
};

const TestimonialsPage = ({ readTestimonial }) => (
  <div className="container mx-auto px-4 py-8 min-h-screen font-sans">
    <h2 className="text-4xl font-bold text-center mb-10 text-[#9C271A]">What Our Customers Say</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.map((testimonial, index) => (
        <div key={index} className="bg-white p-6 rounded-3xl shadow-xl flex flex-col items-center text-center">
          <img src={testimonial.image} alt={testimonial.author} className="w-24 h-24 rounded-full mb-4 object-cover" />
          <p className="text-lg text-gray-700 italic mb-4">"{testimonial.text}"</p>
          <p className="font-semibold text-[#9C271A]">- {testimonial.author}</p>
          <button
            onClick={() => readTestimonial(testimonial.text)}
            className="mt-4 px-4 py-2 bg-[#9C271A] text-white text-sm font-semibold rounded-full hover:bg-[#7D1E16] transition-colors flex items-center space-x-2"
          >
            <Volume2 size={16} />
            <span>Read Aloud</span>
          </button>
        </div>
      ))}
    </div>
    <audio ref={useRef(null)} controls className="hidden"></audio>
  </div>
);


// -------------------------------------------------------------------------
// Main App Component
// -------------------------------------------------------------------------

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [generatedFestiveRecipe, setGeneratedFestiveRecipe] = useState('');
  const [isGeneratingFestiveRecipe, setIsGeneratingFestiveRecipe] = useState(false);
  const audioRef = useRef(null);

  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [userProfile, setUserProfile] = useState({});
  const [profileMessage, setProfileMessage] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    try {
      const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
      const app = initializeApp(firebaseConfig);
      const authInstance = getAuth(app);
      const dbInstance = getFirestore(app);
      setAuth(authInstance);
      setDb(dbInstance);

      const unsubscribe = onAuthStateChanged(authInstance, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
          const profileDocRef = doc(dbInstance, `artifacts/${appId}/users/${currentUser.uid}/profile`, 'user_data');
          
          const unsubProfile = onSnapshot(profileDocRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setUserProfile(data);
              setCart(data.cart || []);
            } else {
              console.log("No profile data found for this user.");
              setUserProfile({});
              setCart([]);
            }
            setCartCount((docSnap.data()?.cart || []).reduce((total, item) => total + item.quantity, 0));
          }, (error) => {
            console.error("Error fetching user profile:", error);
          });

          if (currentUser.isAnonymous) {
            console.log("Signed in anonymously.");
          } else {
            console.log("User signed in with email:", currentUser.email);
          }
          setIsAuthReady(true);
          return () => unsubProfile();
        } else {
          setUser(null);
          setUserProfile({});
          setCart([]);
          setCartCount(0);
          console.log("User signed out.");
        }
        setIsAuthReady(true);
      });

      const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
      if (initialAuthToken) {
        signInWithCustomToken(authInstance, initialAuthToken).catch(error => {
          console.error("Failed to sign in with custom token:", error);
          signInAnonymously(authInstance);
        });
      } else {
        signInAnonymously(authInstance);
      }

      return () => unsubscribe();
    } catch (e) {
      console.error("Firebase initialization failed:", e);
      setIsAuthReady(true);
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const navigateToPage = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    setAuthError('');
    setCheckoutMessage('');
  };

  const handleGenerateContent = async (productName, contentType) => {
    let userQuery = '';
    if (contentType === 'recipe') {
      userQuery = `Generate a creative recipe idea using "${productName}" as the main ingredient. The recipe should be concise and easy to follow.`;
    } else if (contentType === 'skincare-routine') {
      userQuery = `Suggest a simple 3-step skincare routine using "${productName}" for healthy skin. Include the steps and a short description for each.`;
    }
  
    try {
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const payload = { contents: [{ parts: [{ text: userQuery }] }] };
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || 'Failed to generate content.';
    } catch (error) {
      console.error('Error generating content:', error);
      return 'An error occurred. Please try again.';
    }
  };

  const generateFestiveMessage = async () => {
    setIsGeneratingMessage(true);
    setGeneratedMessage('');
    const text = await handleGenerateContent("a Korean-inspired brand's social media post to celebrate a new milestone", "message");
    setGeneratedMessage(text);
    setIsGeneratingMessage(false);
  };
  
  const generateFestiveRecipe = async () => {
    setIsGeneratingFestiveRecipe(true);
    setGeneratedFestiveRecipe('');
    const text = await handleGenerateContent("a unique fusion recipe for a festive occasion. The recipe should combine traditional Indian sweet elements with Korean ingredients, like a 'Gochujang Modak'", "message");
    setGeneratedFestiveRecipe(text);
    setIsGeneratingFestiveRecipe(false);
  };

  const readTestimonial = async (text) => {
    try {
      const payload = { contents: [{ parts: [{ text: text }] }], generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } } } } };
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      const part = result?.candidates?.[0]?.content?.parts?.[0];
      const audioData = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType;

      if (audioData && mimeType && mimeType.startsWith("audio/L16")) {
        const sampleRate = 16000;
        const pcmData = base64ToArrayBuffer(audioData);
        const pcm16 = new Int16Array(pcmData);
        const wavBlob = pcmToWav(pcm16, sampleRate);
        const audioUrl = URL.createObjectURL(wavBlob);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
        }
      } else {
        console.error("Failed to get audio data from API response.");
      }
    } catch (error) {
      console.error("Error reading testimonial:", error);
    }
  };

  const handleSignUp = async (email, password) => {
    setAuthError('');
    if (!auth) { setAuthError('Authentication service not ready. Please wait.'); return; }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigateToPage('profile');
    } catch (error) {
      console.error("Signup error:", error);
      setAuthError(error.code.includes('email-already-in-use') ? 'This email is already in use.' : 'Signup failed. Please try again.');
    }
  };

  const handleSignIn = async (email, password) => {
    setAuthError('');
    if (!auth) { setAuthError('Authentication service not ready. Please wait.'); return; }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigateToPage('profile');
    } catch (error) {
      console.error("Signin error:", error);
      setAuthError(error.code.includes('invalid-credential') ? 'Invalid email or password.' : 'Signin failed. Please try again.');
    }
  };

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      signInAnonymously(auth);
    }
    navigateToPage('home');
  };

  const saveProfile = async () => {
    if (!db || !user) { setProfileMessage('Error: User not logged in or database not ready.'); return; }
    setIsSavingProfile(true);
    setProfileMessage('');
    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const docRef = doc(db, `artifacts/${appId}/users/${user.uid}/profile`, 'user_data');
      await setDoc(docRef, { ...userProfile, cart }, { merge: true });
      setProfileMessage('Profile saved successfully!');
    } catch (e) {
      console.error("Error saving profile:", e);
      setProfileMessage('Failed to save profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const saveCartToFirestore = async (updatedCart) => {
    if (!db || !user || user.isAnonymous) return;
    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const docRef = doc(db, `artifacts/${appId}/users/${user.uid}/profile`, 'user_data');
      await setDoc(docRef, { cart: updatedCart }, { merge: true });
    } catch (e) {
      console.error("Error saving cart to Firestore:", e);
    }
  };

  const addToCart = (product) => {
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    let updatedCart;
    if (existingItemIndex > -1) {
      updatedCart = cart.map((item, index) =>
        index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(updatedCart);
    saveCartToFirestore(updatedCart);
  };

  const updateQuantity = (productId, change) => {
    const updatedCart = cart.map(item =>
      item.id === productId ? { ...item, quantity: item.quantity + change } : item
    ).filter(item => item.quantity > 0);
    setCart(updatedCart);
    saveCartToFirestore(updatedCart);
  };
  
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    saveCartToFirestore(updatedCart);
  };

  const calculateTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  const handleCheckout = () => {
    if (cart.length === 0) {
      setCheckoutMessage('Your cart is empty. Please add items to proceed.');
      return;
    }
    setCheckoutMessage('Processing your order...');
    setTimeout(async () => {
      setCart([]);
      saveCartToFirestore([]);
      setCheckoutMessage('Payment successful! Your order has been placed.');
      setIsCheckoutOpen(false);
    }, 2000);
  };

  const handleProfileChange = (e) => setUserProfile({ ...userProfile, [e.target.name]: e.target.value });

  const renderPage = () => {
    switch (currentPage) {
      case 'products':
        return <ProductsPage addToCart={addToCart} generateContent={handleGenerateContent} isGenerating={isGeneratingMessage || isGeneratingFestiveRecipe} />;
      case 'profile':
        return <ProfilePage user={user} userProfile={userProfile} handleProfileChange={handleProfileChange} handleSignOut={handleSignOut} saveProfile={saveProfile} isSavingProfile={isSavingProfile} profileMessage={profileMessage} handleSignUp={handleSignUp} handleSignIn={handleSignIn} authError={authError} />;
      case 'cart':
        return <CartPage cart={cart} totalItems={totalItems} calculateTotal={calculateTotal} updateQuantity={updateQuantity} removeFromCart={removeFromCart} handleCheckout={handleCheckout} isCheckoutOpen={isCheckoutOpen} setIsCheckoutOpen={setIsCheckoutOpen} checkoutMessage={checkoutMessage} setCheckoutMessage={setCheckoutMessage} navigateToPage={navigateToPage} />;
      case 'testimonials':
        return <TestimonialsPage readTestimonial={readTestimonial} />;
      default:
        return <HomePage navigateToPage={navigateToPage} generateFestiveMessage={generateFestiveMessage} isGeneratingMessage={isGeneratingMessage} generatedMessage={generatedMessage} generateFestiveRecipe={generateFestiveRecipe} isGeneratingFestiveRecipe={isGeneratingFestiveRecipe} generatedFestiveRecipe={generatedFestiveRecipe} />;
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8E1]">
        <div className="text-center text-[#9C271A]">
          <h1 className="text-3xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }
  
  return (
    <div className="font-sans bg-[#FFF8E1] min-h-screen text-[#9C271A]">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 shadow-lg py-4 px-6 md:px-12 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#9C271A] cursor-pointer" onClick={() => navigateToPage('home')}>
          Seoul<span className="text-[#FFB500]">Veda</span>
        </h1>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <button onClick={() => navigateToPage('home')} className="nav-link font-semibold hover:text-[#FFB500] transition-colors">Home</button>
          <button onClick={() => navigateToPage('products')} className="nav-link font-semibold hover:text-[#FFB500] transition-colors">Products</button>
          <button onClick={() => navigateToPage('testimonials')} className="nav-link font-semibold hover:text-[#FFB500] transition-colors">Testimonials</button>
        </nav>
        {/* Desktop Icons */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative">
            <button onClick={() => navigateToPage('cart')} className="relative nav-icon">
              <ShoppingCart size={24} className="text-[#9C271A] hover:text-[#FFB500] transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#9C271A] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
          <button onClick={() => navigateToPage('profile')} className="nav-icon">
            <User size={24} className="text-[#9C271A] hover:text-[#FFB500] transition-colors" />
          </button>
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-[#9C271A]">
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="fixed inset-0 bg-white z-30 flex flex-col items-center justify-center space-y-8 md:hidden">
          <button onClick={() => navigateToPage('home')} className="text-2xl font-bold text-[#9C271A] hover:text-[#FFB500] transition-colors">Home</button>
          <button onClick={() => navigateToPage('products')} className="text-2xl font-bold text-[#9C271A] hover:text-[#FFB500] transition-colors">Products</button>
          <button onClick={() => navigateToPage('testimonials')} className="text-2xl font-bold text-[#9C271A] hover:text-[#FFB500] transition-colors">Testimonials</button>
          <div className="flex items-center space-x-8 mt-4">
            <button onClick={() => navigateToPage('profile')} className="p-3 bg-[#FFF8E1] rounded-full text-[#9C271A] shadow-md">
              <User size={28} />
            </button>
            <button onClick={() => navigateToPage('cart')} className="relative p-3 bg-[#FFF8E1] rounded-full text-[#9C271A] shadow-md">
              <ShoppingCart size={28} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#9C271A] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/4 -translate-y-1/4">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="pb-16 pt-8">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-[#5C0A04] text-gray-300 py-12 font-serif">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">SeoulVeda</h3>
              <p className="text-sm">
                Bringing the best of Korean ramen and skincare to your doorstep.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigateToPage('home')} className="hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => navigateToPage('products')} className="hover:text-white transition-colors">Products</button></li>
                <li><button onClick={() => navigateToPage('testimonials')} className="hover:text-white transition-colors">Testimonials</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Account</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigateToPage('profile')} className="hover:text-white transition-colors">My Profile</button></li>
                <li><button onClick={() => navigateToPage('cart')} className="hover:text-white transition-colors">My Cart</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm">
                <li>Email: support@seoulveda.com</li>
                <li>Phone: +91 98765 43210</li>
                <li>Address: 123 Seoul Lane, Gangnam, Seoul</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center text-sm text-gray-500">
            © 2024 SeoulVeda. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
