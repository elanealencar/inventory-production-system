import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from './layout/NavBar';
import { ProductsPage } from './pages/ProductsPage';
import { RawMaterialsPage } from './pages/RawMaterialsPage';
import { SuggestionPage } from './pages/SuggestionPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/raw-materials" element={<RawMaterialsPage />} />
          <Route path="/suggestion" element={<SuggestionPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
