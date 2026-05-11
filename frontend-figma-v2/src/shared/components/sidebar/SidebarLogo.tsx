import isotipoSvg from '@/assets/isotipo.svg';

export function SidebarLogo() {
  return (
    <div className="pt-6 px-5 pb-6">
      <img src={isotipoSvg} alt="Licénciame" className="h-7" />
    </div>
  );
}
