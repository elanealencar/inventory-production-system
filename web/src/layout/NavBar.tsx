import { NavLink } from 'react-router-dom';

const linkClass =
  'px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition';

const activeClass = 'bg-gray-200';

export function Navbar() {
  return (
    <header className="border-b">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Inventory Production</h1>

        <nav className="flex gap-2">
          <NavLink to="/products" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''}`}>
            Products
          </NavLink>
          <NavLink to="/raw-materials" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''}`}>
            Raw Materials
          </NavLink>
          <NavLink to="/suggestion" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''}`}>
            Suggestion
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
