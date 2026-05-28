import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ProfileSidebar from "../components/account/ProfileSidebar";
import OrdersTab from "../components/account/OrdersTab";
import WishlistTab from "../components/account/WishlistTab";
import PaymentMethodsTab from "../components/account/PaymentMethodsTab";
import ReviewsTab from "../components/account/ReviewsTab";
import AddressesTab from "../components/account/AddressesTab";
import SettingsTab from "../components/account/SettingsTab";

export default function Account() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const [activeTab, setActiveTab] = useState("orders"); // orders, wishlist, payment, reviews, addresses, settings
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main>
      <div className="bg-teal-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">حساب کاربری</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><a href="/" className="text-teal-600 hover:underline">خانه</a></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">حساب کاربری</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4" data-aos="fade-up" data-aos-delay="100">
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full bg-gray-100 py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <i className="bi bi-grid"></i>
              <span>منو حساب</span>
            </button>
          </div>

          <div className="flex flex-wrap -mx-4">
            <div className={`w-full lg:w-3/12 px-4 mb-8 lg:mb-0 ${mobileMenuOpen ? "block" : "hidden lg:block"}`}>
              <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <div className="w-full lg:w-9/12 px-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                {activeTab === "orders" && <OrdersTab />}
                {activeTab === "wishlist" && <WishlistTab />}
                {activeTab === "payment" && <PaymentMethodsTab />}
                {activeTab === "reviews" && <ReviewsTab />}
                {activeTab === "addresses" && <AddressesTab />}
                {activeTab === "settings" && <SettingsTab />}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
