import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Account from "./pages/Account";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import CourseDetails from "./pages/CourseDetails";
import Courses from "./pages/Courses";
import Login from "./pages/Login";
import OrderConfirmation from "./pages/OrderConfirmation";
import Trainers from "./pages/Trainers";


function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/course/:slug" element={<CourseDetails />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/login" element={<Login />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/trainers" element={<Trainers />} />

        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;