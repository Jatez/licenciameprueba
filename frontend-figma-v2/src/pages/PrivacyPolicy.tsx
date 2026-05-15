import { Link } from "react-router-dom";
import { Shield, ChevronLeft } from "lucide-react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="text-lg font-semibold text-foreground mb-3">{title}</h2>
    <div className="text-muted-foreground text-sm leading-relaxed space-y-2">{children}</div>
  </section>
);

export default function PrivacyPolicy() {
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
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Política de Privacidad</h1>
        </div>
        <p className="text-xs text-muted-foreground mb-10">
          Última actualización: 15 de enero de 2025 · Licenciame SAS · Colombia
        </p>

        <div className="prose-invert">
          <Section title="1. Responsable del Tratamiento">
            <p>
              <strong className="text-foreground">Licenciame SAS</strong> (en adelante «Licenciame»), con domicilio en
              Colombia, es el responsable del tratamiento de los datos personales recolectados a través de la plataforma
              disponible en <span className="text-primary">app.licenciame.com</span>.
            </p>
            <p>
              Para ejercer sus derechos o consultar dudas sobre privacidad, puede contactarnos en:{" "}
              <a href="mailto:privacidad@licenciame.com" className="text-primary hover:underline">
                privacidad@licenciame.com
              </a>
            </p>
          </Section>

          <Section title="2. Datos Personales que Recopilamos">
            <p>Recopilamos los siguientes datos según la funcionalidad que usted utilice:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <strong className="text-foreground">Datos de cuenta:</strong> nombre, correo electrónico, nombre de
                empresa y país al momento del registro.
              </li>
              <li>
                <strong className="text-foreground">Datos de autenticación OAuth:</strong> cuando conecta cuentas de
                Meta (Instagram/Facebook) o TikTok, recibimos tokens de acceso y datos públicos de perfil (nombre de
                usuario, avatar, estadísticas de seguidores). No almacenamos contraseñas de terceros.
              </li>
              <li>
                <strong className="text-foreground">Datos de uso:</strong> licencias adquiridas, tracks consultados,
                historial de compras y configuraciones de monitoreo.
              </li>
              <li>
                <strong className="text-foreground">Datos técnicos:</strong> dirección IP, tipo de navegador, sistema
                operativo y registros de acceso (logs) con fines de seguridad y diagnóstico.
              </li>
            </ul>
          </Section>

          <Section title="3. Uso de OAuth (Meta / TikTok)">
            <p>
              Licenciame utiliza OAuth 2.0 para conectar cuentas de redes sociales. Este proceso:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>No accede a sus mensajes privados ni publicaciones personales.</li>
              <li>Solo solicita los permisos mínimos necesarios para monitorear el uso de música licenciada.</li>
              <li>
                Los tokens de acceso se almacenan cifrados (Fernet AES-128) y nunca se comparten con terceros.
              </li>
              <li>Puede revocar el acceso en cualquier momento desde la configuración de su cuenta.</li>
            </ul>
          </Section>

          <Section title="4. Finalidades del Tratamiento">
            <p>Sus datos se utilizan exclusivamente para:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Crear y gestionar su cuenta en la plataforma.</li>
              <li>Emitir, entregar y registrar licencias musicales.</li>
              <li>Procesar pagos y enviar confirmaciones transaccionales por correo.</li>
              <li>Monitorear publicaciones en redes sociales que usen música de nuestro catálogo.</li>
              <li>Cumplir con obligaciones legales aplicables en Colombia.</li>
              <li>Mejorar la plataforma mediante análisis de uso agregado y anonimizado.</li>
            </ul>
          </Section>

          <Section title="5. Cookies y Tecnologías de Seguimiento">
            <p>
              Licenciame utiliza cookies estrictamente necesarias para mantener su sesión activa y garantizar la
              seguridad de la autenticación. No utilizamos cookies de seguimiento publicitario ni compartimos datos con
              redes de publicidad.
            </p>
            <p>
              Puede configurar su navegador para bloquear o eliminar cookies, aunque esto puede afectar el
              funcionamiento de la plataforma.
            </p>
          </Section>

          <Section title="6. Derechos ARCO">
            <p>
              De conformidad con la Ley 1581 de 2012 (Ley de Protección de Datos Personales de Colombia) y sus
              decretos reglamentarios, usted tiene los siguientes derechos:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <strong className="text-foreground">Acceso:</strong> conocer qué datos personales suyos tratamos.
              </li>
              <li>
                <strong className="text-foreground">Rectificación:</strong> solicitar la corrección de datos
                incorrectos o incompletos.
              </li>
              <li>
                <strong className="text-foreground">Cancelación (supresión):</strong> pedir la eliminación de sus
                datos cuando ya no sean necesarios.
              </li>
              <li>
                <strong className="text-foreground">Oposición:</strong> oponerse al tratamiento de sus datos para
                finalidades específicas.
              </li>
            </ul>
            <p className="mt-2">
              Para ejercer estos derechos, envíe su solicitud a{" "}
              <a href="mailto:privacidad@licenciame.com" className="text-primary hover:underline">
                privacidad@licenciame.com
              </a>
              . Responderemos en un plazo máximo de 15 días hábiles.
            </p>
          </Section>

          <Section title="7. Transferencia Internacional de Datos">
            <p>
              Sus datos pueden ser procesados en servidores ubicados fuera de Colombia (p. ej., para servicios de
              infraestructura en la nube). En tales casos, garantizamos que los proveedores cuenten con medidas de
              seguridad equivalentes a las exigidas por la ley colombiana.
            </p>
          </Section>

          <Section title="8. Seguridad">
            <p>
              Implementamos medidas técnicas y organizativas adecuadas para proteger sus datos: cifrado en tránsito
              (TLS 1.2+), cifrado en reposo para datos sensibles, control de acceso por roles y registros de auditoría.
              Sin embargo, ningún sistema es 100% infalible; si detecta una vulnerabilidad, repórtela a{" "}
              <a href="mailto:seguridad@licenciame.com" className="text-primary hover:underline">
                seguridad@licenciame.com
              </a>
              .
            </p>
          </Section>

          <Section title="9. Retención de Datos">
            <p>
              Conservamos sus datos mientras su cuenta esté activa. Al cerrar su cuenta, los datos se eliminan en un
              plazo de 30 días, salvo aquellos que deban conservarse por obligaciones legales (p. ej., registros
              contables durante 5 años según la ley colombiana).
            </p>
          </Section>

          <Section title="10. Cambios a esta Política">
            <p>
              Podemos actualizar esta política periódicamente. Le notificaremos los cambios materiales por correo
              electrónico o mediante un aviso en la plataforma con al menos 15 días de anticipación.
            </p>
          </Section>
        </div>

        {/* Footer nav */}
        <div className="mt-12 pt-6 border-t border-border flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link to="/terms" className="hover:text-foreground transition-colors">
            Términos de uso
          </Link>
          <a href="mailto:privacidad@licenciame.com" className="hover:text-foreground transition-colors">
            Contacto privacidad
          </a>
        </div>
      </div>
    </div>
  );
}
