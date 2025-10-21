import { useEffect, useRef, useState } from "react";
import {
  ShoppingCart,
  Phone,
  Menu,
  X,
  Wrench,
  MapPin,
  Clock,
  Package
} from "lucide-react";
import { Typewriter } from "react-simple-typewriter";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  type: "Car" | "Bike";
}

const videos = ["/videos/bg.mp4", "/videos/bu.mp4", "/videos/bg.mp4", "/videos/bu.mp4"];

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Car" | "Bike">("All");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [language, setLanguage] = useState<"EN" | "TA">("EN");

  const [currentVideoIndex, setCurrentVideoIndex] = useState(Math.floor(Math.random() * videos.length));
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoEnd = () => setCurrentVideoIndex((prev) => (prev + 1) % videos.length);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = videos[currentVideoIndex];
      videoRef.current.play().catch(() => {});
    }
  }, [currentVideoIndex]);


  const products: Product[] = [
    // Car parts
    { id: 1, name: "Brake Pads", category: "Braking System", price: 500, image: "https://images.pexels.com/photos/13861/IMG_3496bfree.jpg?auto=compress&cs=tinysrgb&w=800", description: "High-performance ceramic brake pads", type: "Car" },
    { id: 2, name: "Oil Filter", category: "Engine Parts", price: 1299, image: "https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Premium quality oil filter for engine protection", type: "Car" },
    { id: 3, name: "Air Filter", category: "Engine Parts", price: 1850, image: "https://images.pexels.com/photos/7541975/pexels-photo-7541975.jpeg", description: "High-flow air filter for optimal performance", type: "Car" },
    { id: 4, name: "Spark Plugs Set", category: "Ignition System", price: 3299, image: "https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Iridium spark plugs - set of 4", type: "Car" },
    { id: 5, name: "Battery", category: "Electrical", price: 12999, image: "https://images.pexels.com/photos/257700/pexels-photo-257700.jpeg?auto=compress&cs=tinysrgb&w=800", description: "12V maintenance-free car battery", type: "Car" },
    // Bike parts
    { id: 6, name: "Bike Chain Set", category: "Transmission", price: 4299, image: "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Durable bike chain and sprocket kit", type: "Bike" },
    { id: 7, name: "Helmet", category: "Safety Gear", price: 5999, image: "https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=800", description: "ISI-certified aerodynamic helmet", type: "Bike" },
    { id: 8, name: "Bike Battery", category: "Electrical", price: 4999, image: "https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=800", description: "12V maintenance-free bike battery", type: "Bike" },
    { id: 9, name: "LED Headlight", category: "Lighting", price: 1999, image: "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=800", description: "High-intensity LED headlight for motorcycles", type: "Bike" },
  ];
  
  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart(cart.map((item) =>
      item.product.id === productId
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const getTotalPrice = () => cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const orderViaWhatsApp = () => {
    if (cart.length === 0) return;
    if (!customerName || !customerPhone) {
      alert(language === "EN" ? "Please enter your name and mobile number!" : "உங்கள் பெயர் மற்றும் மொபைல் எண்ணை உள்ளிடவும்!");
      return;
    }

    const phoneNumber = "919442351404"; // include country code
    let message = language === "EN"
      ? `Hello! My name is ${customerName}.\nMobile: ${customerPhone}\n\nI would like to order:\n\n`
      : `வணக்கம்! என் பெயர் ${customerName}.\nமொபைல்: ${customerPhone}\n\nநான் ஆர்டர் செய்ய விரும்புகிறேன்:\n\n`;

    cart.forEach((item) => {
      message += `${item.quantity}x ${item.product.name} - $${(item.product.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n${language === "EN" ? "Total" : "மொத்தம்"}: $${getTotalPrice().toFixed(2)}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const filteredProducts = selectedCategory === "All" ? products : products.filter(p => p.type === selectedCategory);

  // Text translations
  const texts = {
    hero: language === "EN"
      ? ["Your Car, Our Parts", "Drive Smooth. Drive Safe.", "Premium Auto Components"]
      : ["உங்கள் கார், எங்கள் பாகங்கள்", "மிருதுவாக ஓட்டவும். பாதுகாப்பாக ஓட்டவும்.", "பிரீமியம் ஆட்டோ பாகங்கள்"],
    shopNow: language === "EN" ? "Shop Now" : "கண்காணி செய்யவும்",
    products: language === "EN" ? "Our Products" : "எங்கள் பாகங்கள்",
    aboutTitle: language === "EN" ? "Why Choose AutoParts Pro?" : "ஏன் AutoParts Pro ஐ தேர்வு செய்ய வேண்டும்?",
    contactTitle: language === "EN" ? "Get In Touch" : "தொடர்பு கொள்ளவும்",
    orderWhatsApp: language === "EN" ? "Order via WhatsApp" : "வாட்ஸ்அப்பில் ஆர்டர் செய்யவும்"
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-[#FC2414] p-2 rounded-lg"><Wrench className="h-8 w-8 text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">10AutoParts</h1>
              <p className="text-sm text-gray-600">{language === "EN" ? "Quality Parts, Reliable Service" : "உயர்தர பாகங்கள், நம்பகமான சேவை"}</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#products" className="text-gray-700 hover:text-[#FC2414] transition-colors font-medium">{language === "EN" ? "Products" : "பாகங்கள்"}</a>
            <a href="#about" className="text-gray-700 hover:text-[#FC2414] transition-colors font-medium">{language === "EN" ? "About" : "முக்கியத்துவம்"}</a>
            <a href="#contact" className="text-gray-700 hover:text-[#FC2414] transition-colors font-medium">{language === "EN" ? "Contact" : "தொடர்பு"}</a>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={() => setLanguage(language === "EN" ? "TA" : "EN")} className="bg-gray-200 px-3 py-2 rounded-lg">{language === "EN" ? "தமிழ்" : "EN"}</button>
            <button onClick={() => setIsCartOpen(!isCartOpen)} className="relative bg-[#FC2414] text-white p-3 rounded-lg hover:bg-[#d91f11] transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden bg-[#FC2414] text-white p-3 rounded-lg">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative w-full h-[80vh] overflow-hidden">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay muted onEnded={handleVideoEnd} />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <Typewriter words={texts.hero} loop cursor cursorStyle="|" typeSpeed={70} deleteSpeed={50} delaySpeed={1500} />
          </h1>
          <a href="#products" className="bg-[#FC2414] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#d91f11] transition-colors">{texts.shopNow}</a>
        </div>
      </section>

   {/* Products Section */}
      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">{texts.products}</h2>
            <p className="text-xl text-gray-600">{language === "EN" ? "Browse our selection of high-quality auto parts" : "உயர்தர ஆட்டோ பாகங்களை உலாவவும்"}</p>
          </div>

          {/* Category Buttons */}
          <div className="flex justify-center mb-8 space-x-4">
            {["All", "Car", "Bike"].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as "All" | "Car" | "Bike")}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${selectedCategory === category ? "bg-[#FC2414] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                {language === "EN"
                  ? category
                  : category === "All" ? "அனைத்து" : category === "Car" ? "கார்" : "பைக்"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform hover:scale-110 duration-300" />
                  <div className="absolute top-2 right-2 bg-[#FC2414] text-white px-3 py-1 rounded-full text-sm font-bold">₹{product.price}</div>
                </div>
                <div className="p-5">
                  <div className="text-xs font-semibold text-[#FC2414] mb-2">{product.category}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  <button onClick={() => addToCart(product)} className="w-full bg-[#FC2414] text-white py-2 rounded-lg font-bold hover:bg-[#d91f11] transition-colors">
                    {language === "EN" ? "Add to Cart" : "வண்டியில் சேர்க்க"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end pt-20 px-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{language === "EN" ? "Your Cart" : "உங்கள் வண்டி"}</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700"><X className="h-6 w-6" /></button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex flex-col space-y-4">
                  <input type="text" placeholder={language === "EN" ? "Your Name" : "உங்கள் பெயர்"} value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="border p-2 rounded-lg w-full" />
                  <input type="text" placeholder={language === "EN" ? "Mobile Number" : "மொபைல் எண்"} value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="border p-2 rounded-lg w-full" />
                </div>
                {cart.map(item => (
                  <div key={item.product.id} className="flex items-center space-x-4 border-b pb-4">
                    <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                      <p className="text-[#FC2414] font-bold">₹{item.product.price.toFixed(2)}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <button onClick={() => updateQuantity(item.product.id, -1)} className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 font-bold">-</button>
                        <span className="font-semibold text-gray-900">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, 1)} className="bg-[#FC2414] text-white w-8 h-8 rounded-full hover:bg-[#d91f11] font-bold">+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-gray-900">{language === "EN" ? "Total:" : "மொத்தம்:"}</span>
                  <span className="text-[#FC2414]">₹{getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <button onClick={orderViaWhatsApp} className="w-full bg-[#25D366] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#20BD5A] flex items-center justify-center space-x-2">
                <Phone className="h-6 w-6" />
                <span>{texts.orderWhatsApp}</span>
              </button>
            </div>
          </div>
        </div>
      )}
{/* About Section */}
<section id="about" className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          {language === "EN" ? "Why Choose AutoParts Pro?" : "ஏன் AutoParts Pro ஐ தேர்வு செய்ய வேண்டும்?"}
        </h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="bg-[#FC2414] p-2 rounded-lg flex-shrink-0">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {language === "EN" ? "Genuine Quality" : "மூல தரம்"}
              </h3>
              <p className="text-gray-600">
                {language === "EN"
                  ? "All our parts are sourced from trusted manufacturers and guaranteed authentic."
                  : "எங்கள் அனைத்து பாகங்களும் நம்பகமான உற்பத்தியாளர்களிடமிருந்து பெறப்பட்டவை மற்றும் உண்மையானவை என உத்தரவிடப்பட்டவை."}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-[#FC2414] p-2 rounded-lg flex-shrink-0">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {language === "EN" ? "Quick Service" : "வேகமான சேவை"}
              </h3>
              <p className="text-gray-600">
                {language === "EN"
                  ? "Fast order processing and delivery to get your vehicle back on the road quickly."
                  : "உங்கள் வாகனத்தை விரைவில் மீண்டும் சாலையில் கொண்டு வர விரைவான ஆர்டர் செயலாக்கம் மற்றும் விநியோகம்."}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-[#FC2414] p-2 rounded-lg flex-shrink-0">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {language === "EN" ? "Expert Support" : "திறமையான ஆதரவு"}
              </h3>
              <p className="text-gray-600">
                {language === "EN"
                  ? "Our team is ready to help you find the right parts for your vehicle."
                  : "உங்கள் வாகனத்திற்கு சரியான பாகங்களை கண்டுபிடிக்க எங்கள் குழு தயார்."}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <img
          src="https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Auto parts"
          className="rounded-lg shadow-2xl"
        />
      </div>
    </div>
  </div>
</section>

{/* Contact Section */}
<section id="contact" className="py-16 bg-gray-900 text-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold mb-4">
        {language === "EN" ? "Get In Touch" : "தொடர்பு கொள்ளவும்"}
      </h2>
      <p className="text-xl text-gray-300">
        {language === "EN" ? "Have questions? We're here to help!" : "கேள்விகள் உள்ளதா? நாங்கள் உதவ இங்கே உள்ளோம்!"}
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      <div className="text-center">
        <div className="bg-[#FC2414] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="h-8 w-8" />
        </div>
        <h3 className="font-bold text-lg mb-2">{language === "EN" ? "Phone" : "தொலைபேசி"}</h3>
        <p className="text-gray-300">+1 (234) 567-890</p>
      </div>
      <div className="text-center">
        <div className="bg-[#FC2414] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-8 w-8" />
        </div>
        <h3 className="font-bold text-lg mb-2">{language === "EN" ? "Location" : "இடம்"}</h3>
        <p className="text-gray-300">123 Auto Street, City</p>
      </div>
      <div className="text-center">
        <div className="bg-[#FC2414] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8" />
        </div>
        <h3 className="font-bold text-lg mb-2">{language === "EN" ? "Hours" : "நேரம்"}</h3>
        <p className="text-gray-300">{language === "EN" ? "Mon-Sat: 8AM-8PM" : "திங்கள்-சனி: காலை 8 - மாலை 8"}</p>
      </div>
    </div>

    <div className="text-center mt-12">
      <button
        onClick={() => window.open('https://wa.me/1234567890', '_blank')}
        className="inline-flex items-center space-x-3 bg-[#25D366] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#20BD5A] transition-colors"
      >
        <Phone className="h-6 w-6" />
        <span>{language === "EN" ? "Contact us on WhatsApp" : "வாட்ஸ்அப்பில் எங்களை தொடர்பு கொள்ளவும்"}</span>
      </button>
    </div>
  </div>
</section>

{/* Footer */}
<footer className="bg-gray-950 text-gray-400 py-8">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <p>
      {language === "EN"
        ? "© 2025 10AutoParts Pro. All rights reserved By XevTechSol."
        : "© 2025 10AutoParts Pro. அனைத்து உரிமைகளும் XevTechSol நிறுவனத்தால் பாதுகாக்கப்பட்டவை."}
    </p>
  </div>
</footer>

    </div>
  );
}

export default App;


