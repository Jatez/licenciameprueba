import { Link } from "react-router-dom";
import { ScrollText, ChevronLeft } from "lucide-react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="text-lg font-semibold text-foreground mb-3">{title}</h2>
    <div className="text-muted-foreground text-sm leading-relaxed space-y-2">{children}</div>
  </section>
);

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ScrollText className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Términos de Uso</h1>
        </div>
        <p className="text-xs text-muted-foreground mb-10">
          Última actualización: 15 de enero de 2025 · Licenciame SAS · Colombia
        </p>

        <div>
          <Section title="1. Aceptación de los Términos">
            <p>
              Al crear una cuenta o usar los servicios de <strong className="text-foreground">Licenciame SAS</strong>{" "}
              («Licenciame», «la Plataforma», «nosotros»), usted («Usuario») acepta quedar vinculado por estos Términos
              de Uso. Si no está de acuerdo, no podrá utilizar la Plataforma.
            </p>
          </Section>

          <Section title="2. Descripción del Servicio">
            <p>
              Licenciame es una plataforma SaaS de licenciamiento musical que permite a empresas y creadores de
              contenido en Colombia y Latinoamérica:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Explorar un catálogo de música con derechos gestionados.</li>
              <li>
                Adquirir licencias de uso sincronizado para plataformas como TikTok, Instagram, YouTube y similares.
              </li>
              <li>Monitorear publicaciones en redes sociales que utilicen música licenciada.</li>
              <li>Gestionar créditos prepagados para la obtención de licencias.</li>
            </ul>
          </Section>

          <Section title="3. Registro y Cuenta">
            <p>Para utilizar la Plataforma debe:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Ser una persona jurídica o mayor de 18 años.</li>
              <li>Proporcionar información veraz y actualizada durante el registro.</li>
              <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
              <li>Notificarnos de inmediato sobre cualquier uso no autorizado de su cuenta.</li>
            </ul>
            <p>
              Licenciame se reserva el derecho de suspender o eliminar cuentas que violen estos Términos o que
              proporcionen información falsa.
            </p>
          </Section>

          <Section title="4. Licencias Musicales">
            <p>
              Las licencias emitidas a través de la Plataforma son licencias de uso sincronizado, no exclusivas, que
              otorgan al Usuario el derecho de:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                Sincronizar la obra musical con contenido audiovisual propio para publicarlo en las plataformas
                especificadas en la licencia.
              </li>
              <li>Usar la obra durante la vigencia indicada en el certificado de licencia.</li>
            </ul>
            <p className="mt-2">Las licencias NO otorgan:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Derechos de distribución, venta o sublicenciamiento de la obra musical.</li>
              <li>Derechos de interpretación pública.</li>
              <li>Derechos sobre la letra o composición de la obra (solo sobre la grabación máster si se indica).</li>
            </ul>
          </Section>

          <Section title="5. Créditos y Pagos">
            <p>
              El acceso a licencias requiere créditos prepagados. Los créditos son:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>No reembolsables una vez utilizados para obtener una licencia.</li>
              <li>
                Sujetos a la vigencia del paquete adquirido (ver condiciones del paquete específico al momento de la
                compra).
              </li>
              <li>No transferibles a otras cuentas.</li>
            </ul>
            <p>
              Los precios se expresan en pesos colombianos (COP) o dólares estadounidenses (USD) según se indique, e
              incluyen los impuestos aplicables.
            </p>
          </Section>

          <Section title="6. Uso Aceptable">
            <p>El Usuario se compromete a NO:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                Usar la Plataforma para fines ilegales o que violen derechos de propiedad intelectual de terceros.
              </li>
              <li>Revender, redistribuir o ceder licencias obtenidas en la Plataforma.</li>
              <li>
                Realizar ingeniería inversa, descompilar o intentar extraer el código fuente de la Plataforma.
              </li>
              <li>
                Usar medios automatizados (bots, scrapers) para acceder a la Plataforma sin autorización escrita.
              </li>
              <li>
                Difundir contenido falso, engañoso o que atente contra la reputación de Licenciame o de los artistas
                del catálogo.
              </li>
            </ul>
          </Section>

          <Section title="7. Propiedad Intelectual">
            <p>
              Todos los derechos sobre la Plataforma (código, diseño, marca, logotipo) pertenecen a Licenciame SAS. El
              catálogo musical es propiedad de los titulares de derechos correspondientes. El uso de la Plataforma no
              transfiere ningún derecho de propiedad intelectual al Usuario.
            </p>
          </Section>

          <Section title="8. Limitación de Responsabilidad">
            <p>
              La Plataforma se provee «tal como está». Licenciame no garantiza disponibilidad ininterrumpida ni que el
              servicio estará libre de errores. En ningún caso Licenciame será responsable por:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Daños indirectos, incidentales o consecuentes derivados del uso de la Plataforma.</li>
              <li>
                Reclamaciones de terceros por el uso de licencias adquiridas fuera de los términos autorizados.
              </li>
              <li>Interrupciones del servicio causadas por fuerza mayor o fallos de infraestructura de terceros.</li>
            </ul>
            <p>
              La responsabilidad máxima de Licenciame frente al Usuario no excederá el valor pagado en los últimos 3
              meses de servicio.
            </p>
          </Section>

          <Section title="9. Modificaciones al Servicio y a los Términos">
            <p>
              Licenciame puede modificar estos Términos en cualquier momento. Los cambios materiales serán notificados
              por correo electrónico con al menos 15 días de anticipación. El uso continuado de la Plataforma tras la
              vigencia de los nuevos Términos implica su aceptación.
            </p>
            <p>
              Licenciame también puede modificar, suspender o discontinuar funcionalidades de la Plataforma con aviso
              previo razonable.
            </p>
          </Section>

          <Section title="10. Terminación">
            <p>
              El Usuario puede cancelar su cuenta en cualquier momento desde la configuración. Licenciame puede
              suspender o terminar el acceso de forma inmediata en caso de violación de estos Términos, sin perjuicio
              de otras acciones legales.
            </p>
          </Section>

          <Section title="11. Ley Aplicable y Jurisdicción">
            <p>
              Estos Términos se rigen por las leyes de la República de Colombia. Cualquier disputa será sometida a la
              jurisdicción de los tribunales competentes de la ciudad de Bogotá D.C., Colombia.
            </p>
          </Section>

          <Section title="12. Contacto">
            <p>
              Para consultas sobre estos Términos, contáctenos en:{" "}
              <a href="mailto:legal@licenciame.com" className="text-primary hover:underline">
                legal@licenciame.com
              </a>
            </p>
          </Section>
        </div>

        {/* Footer nav */}
        <div className="mt-12 pt-6 border-t border-border flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link to="/privacy" className="hover:text-foreground transition-colors">
            Política de privacidad
          </Link>
          <a href="mailto:legal@licenciame.com" className="hover:text-foreground transition-colors">
            Contacto legal
          </a>
        </div>
      </div>
    </div>
  );
}
