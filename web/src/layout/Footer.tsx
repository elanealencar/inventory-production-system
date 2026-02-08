import logo from '../assets/projedata-logo.png';

export function Footer() {
  return (
    <footer className="text-white text-md">
      <div className="px-4 py-3 flex items-center justify-between bg-[#0c0f3d]">
        <p>Desafio Técnico - Desenvolvedor de Software Full Stack Júnior</p>
        <div className='flex flex-row gap-4 items-center'>
          <img src={logo} alt="Projedata Logo" className="h-11" />
        </div>  
      </div>
    </footer>
  );
}
