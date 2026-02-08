import { NavLink } from 'react-router-dom';
import logo from '../assets/projedata-logo.png';

const linkClass =
  'px-3 py-2 font-medium hover:border-b-3 border-gray-500 transition';

const activeClass = 'border-b-3 border-gray-500';

export function Navbar() {
  return (
    <header className="border-b text-white text-md">
      <div className="mx-auto px-4 py-3 flex items-center justify-between bg-[#0c0f3d]">
        <div className='flex flex-row gap-4 items-center'>
          <img src={logo} alt="Projedata Logo" className="h-11" />
          <h1 className="text-2xl font-semibold mb-1">Inventory Production</h1>
        </div>

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
