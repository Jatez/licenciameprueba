import { DSSectionHeader } from "../../components/DSSectionHeader";
import { CodeBlock, Subsection, PreviewBox } from "./_shared";

const TODAY = "2026-04-23";

const INPUT_MODES = [
  { type: "Email", inputMode: "email", autoComplete: "email", html: 'type="email"' },
  { type: "Teléfono", inputMode: "tel", autoComplete: "tel", html: 'type="tel"' },
  { type: "Numérico (ej. cantidad)", inputMode: "numeric", autoComplete: "off", html: 'type="text"' },
  { type: "Decimal (ej. precio)", inputMode: "decimal", autoComplete: "off", html: 'type="text"' },
  { type: "Búsqueda", inputMode: "search", autoComplete: "off", html: 'type="search"' },
  { type: "URL", inputMode: "url", autoComplete: "url", html: 'type="url"' },
  { type: "Contraseña", inputMode: "text", autoComplete: "current-password", html: 'type="password"' },
  { type: "Nuevo password", inputMode: "text", autoComplete: "new-password", html: 'type="password"' },
  { type: "Nombre", inputMode: "text", autoComplete: "name", html: 'type="text"' },
  { type: "OTP / código 6 dígitos", inputMode: "numeric", autoComplete: "one-time-code", html: 'type="text"' },
];

export function FormsMobileSection() {
  return (
    <>
      <DSSectionHeader
        id="responsive-forms"
        title="Forms on mobile"
        status="stable"
        lastUpdate={TODAY}
      />
      <Subsection
        id="responsive-forms-rules"
        title="Reglas de oro"
        description="Cualquier formulario debe ser usable con teclado en pantalla y un solo dedo."
      >
        <ul className="text-sm text-foreground space-y-2 list-disc list-inside max-w-3xl mb-3">
          <li>Labels SIEMPRE encima del input — nunca al lado en móvil.</li>
          <li><code className="text-xs bg-muted px-1 rounded">text-base</code> en inputs (16px) para evitar el zoom automático de iOS.</li>
          <li>Multi-columna se vuelve una sola columna: <code className="text-xs bg-muted px-1 rounded">grid-cols-1 md:grid-cols-2</code>.</li>
          <li>Botones de submit ancho completo en móvil: <code className="text-xs bg-muted px-1 rounded">w-full md:w-auto</code>.</li>
          <li>Atributos <code className="text-xs bg-muted px-1 rounded">inputMode</code> y <code className="text-xs bg-muted px-1 rounded">autoComplete</code> obligatorios.</li>
        </ul>
      </Subsection>

      <Subsection
        id="responsive-forms-attrs"
        title="Quick reference: inputMode + autoComplete"
        description="Usa estos atributos para que el teclado virtual y el autorelleno funcionen correctamente."
      >
        <div className="bg-card rounded-card border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-3 font-semibold">Tipo</th>
                <th className="text-left p-3 font-semibold">inputMode</th>
                <th className="text-left p-3 font-semibold">autoComplete</th>
                <th className="text-left p-3 font-semibold">type</th>
              </tr>
            </thead>
            <tbody>
              {INPUT_MODES.map((m) => (
                <tr key={m.type} className="border-t border-border">
                  <td className="p-3 font-medium">{m.type}</td>
                  <td className="p-3"><code className="text-xs bg-muted px-1 rounded">{m.inputMode}</code></td>
                  <td className="p-3"><code className="text-xs bg-muted px-1 rounded">{m.autoComplete}</code></td>
                  <td className="p-3"><code className="text-xs bg-muted px-1 rounded">{m.html}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Subsection>

      <Subsection
        id="responsive-forms-example"
        title="Ejemplo en vivo"
      >
        <PreviewBox>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rf-name" className="text-xs md:text-sm font-medium text-foreground">
                  Nombre completo
                </label>
                <input
                  id="rf-name"
                  type="text"
                  inputMode="text"
                  autoComplete="name"
                  placeholder="Ana García"
                  className="text-base h-11 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rf-email" className="text-xs md:text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="rf-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="ana@empresa.com"
                  className="text-base h-11 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rf-phone" className="text-xs md:text-sm font-medium text-foreground">
                Teléfono
              </label>
              <input
                id="rf-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+34 600 000 000"
                className="text-base h-11 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="button"
              className="h-11 w-full md:w-auto px-6 rounded-pill bg-primary text-lm-black font-medium hover:bg-primary-hover"
            >
              Guardar cambios
            </button>
          </form>
        </PreviewBox>
        <CodeBlock
          code={`<form className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="flex flex-col gap-1.5">
      <label htmlFor="email" className="text-xs md:text-sm font-medium">Email</label>
      <input
        id="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        className="text-base h-11 px-3 rounded-md border"
      />
    </div>
  </div>
  <Button className="h-11 w-full md:w-auto">Guardar</Button>
</form>`}
        />
      </Subsection>
    </>
  );
}
