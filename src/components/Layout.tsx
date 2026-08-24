import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollManager } from "./Ui";

export function Layout() {
  return (
    <>
      <ScrollManager />
      <Navbar />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}