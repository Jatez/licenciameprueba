import logotipoSvg from "@/assets/brand-logotipo.svg";

export function SidebarLogo() {
  return (
    <div className="pt-6 px-5 pb-6">
      <img src={logotipoSvg} alt="Licénciame" className="h-7 w-auto" />
    </div>
  );
}
