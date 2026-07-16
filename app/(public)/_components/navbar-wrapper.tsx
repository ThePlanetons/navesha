"use client";

import { useEffect, useState } from "react";

// import TopBanner from "./top-banner";
import Navbar from "./navbar";

  export default function NavbarWrapper() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 20);
      };

      window.addEventListener("scroll", handleScroll);

      return () =>
        window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
      <div className="fixed top-0 left-0 w-full z-50">
        {/* <TopBanner scrolled={scrolled} /> */}

        <Navbar scrolled={scrolled} />
      </div>
    );
  }