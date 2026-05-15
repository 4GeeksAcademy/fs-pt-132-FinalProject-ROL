import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import "../assets/fonts.css";
import "../variables.css";

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
  const location = useLocation();
  return (
    <ScrollToTop location={location}>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </ScrollToTop>
  );
};
