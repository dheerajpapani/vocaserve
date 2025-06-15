// src/components/Layout.jsx
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {/* page-content adds padding-top so content is below navbar */}
      <main className="page-content">
        {children}
      </main>
    </>
  );
}
