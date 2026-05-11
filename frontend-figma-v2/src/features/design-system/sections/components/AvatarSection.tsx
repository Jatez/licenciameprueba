import { Avatar } from "@/shared/components/ds/Avatar";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import { DSSectionBody } from "../../components/DSSectionBody";
import {
  DSComponentSpec,
  DSAnatomy,
  DSVariants,
  DSStates,
  DSCode,
  DSCollapsibleA11y,
  DSCollapsibleTokens,
  DSUsage,
} from "../../components/spec";

const TODAY = "2026-04-24";

const AVATAR_ANATOMY = [
  { name: "image", desc: "<img> con object-cover. Si falla onError, cae a iniciales o placeholder." },
  { name: "initials", desc: "Texto 1-3 chars en uppercase, font-medium, font-tnum para alineación visual." },
  { name: "placeholder", desc: "Icono User de Lucide cuando no hay src ni initials." },
  { name: "status dot", desc: "Indicador absolute bottom-right (~25% del tamaño) con ring del color de fondo." },
];

const AVATAR_A11Y = [
  'role="img" aplicado solo cuando renderiza initials o placeholder; con imagen real el alt nativo basta.',
  "Pasa alt='' si la imagen es decorativa y el contexto ya describe a la persona.",
  "aria-label opcional cuando el avatar transmite significado (ej. acción de cuenta).",
  "Las initials se renderizan con aria-hidden — el role del wrapper expone la etiqueta correcta.",
  "Status dot es decorativo (aria-hidden); el estado de presencia debe explicarse en texto adyacente.",
];

const AVATAR_DOS = [
  "Usar tone='primary' para el avatar de cuenta del usuario activo.",
  "Usar tone='muted' para participantes/colaboradores secundarios.",
  "Pasar siempre initials cuando hay src — sirve de fallback automático si la imagen falla.",
  "Elegir size en función de la jerarquía: xs en tags, sm en filas densas, md en headers de cuenta, lg/xl en perfiles.",
];

const AVATAR_DONTS = [
  "Reimplementar el div circular con bg-primary inline — usa esta primitiva.",
  "Forzar initials de 4+ caracteres (se trunca a 3 silenciosamente, mejor abrevia tú).",
  "Usar el avatar como botón sin envolverlo en un <button> real (no añade semántica interactiva por sí solo).",
  "Aplicar bordes/anillos custom — si necesitas variantes nuevas, extiende la primitiva.",
];

const AVATAR_CODE = `import { Avatar } from "@/shared/components/ds/Avatar";

// Cuenta del usuario activo (sidebar)
<Avatar initials="MG" tone="primary" size="md" aria-label="María Gómez" />

// Con imagen + fallback automático a iniciales si falla
<Avatar
  src="/avatars/maria.jpg"
  alt="María Gómez"
  initials="MG"
  size="lg"
/>

// Con presencia
<Avatar initials="JR" tone="muted" size="md" status="online" />

// Sin datos → placeholder
<Avatar size="sm" />`;

export function AvatarSection() {
  return (
    <>
      <DSSectionHeader
        id="avatar"
        title="Avatar"
        status="stable"
        lastUpdate={TODAY}
        componentName="<Avatar />"
      />
      <DSComponentSpec
        description="Superficie circular o redondeada que representa a una persona o entidad. Renderiza imagen con fallback automático a iniciales y, en última instancia, a un icono placeholder."
        layout="split"
      >
        <DSSectionBody
          layout="split"
          left={
            <>
              <DSAnatomy parts={AVATAR_ANATOMY} />
              <DSUsage dos={AVATAR_DOS} donts={AVATAR_DONTS} />
              <DSCollapsibleA11y items={AVATAR_A11Y} />
              <DSCollapsibleTokens
                tokens={[
                  "h-5/h-7/h-9/h-12/h-16 (xs/sm/md/lg/xl)",
                  "rounded-full (circle)",
                  "rounded-md (rounded)",
                  "bg-primary text-primary-foreground (tone primary)",
                  "bg-muted text-foreground (tone muted)",
                  "bg-foreground/10 text-foreground (tone neutral)",
                  "font-tnum (initials)",
                  "bg-success / bg-warning / bg-muted-foreground (status)",
                  "ring-background (status ring)",
                ]}
              />
            </>
          }
          right={
            <>
              <DSVariants>
                <div className="space-y-6">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Sizes · xs / sm / md / lg / xl
                    </p>
                    <div className="flex items-end gap-4 rounded-card border border-border bg-card p-4">
                      <Avatar initials="MG" size="xs" tone="primary" />
                      <Avatar initials="MG" size="sm" tone="primary" />
                      <Avatar initials="MG" size="md" tone="primary" />
                      <Avatar initials="MG" size="lg" tone="primary" />
                      <Avatar initials="MG" size="xl" tone="primary" />
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Tones · primary / muted / neutral
                    </p>
                    <div className="flex items-center gap-4 rounded-card border border-border bg-card p-4">
                      <Avatar initials="MG" size="md" tone="primary" />
                      <Avatar initials="MG" size="md" tone="muted" />
                      <Avatar initials="MG" size="md" tone="neutral" />
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Shape · circle / rounded
                    </p>
                    <div className="flex items-center gap-4 rounded-card border border-border bg-card p-4">
                      <Avatar initials="MG" size="lg" tone="primary" shape="circle" />
                      <Avatar initials="MG" size="lg" tone="primary" shape="rounded" />
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Status · online / away / offline
                    </p>
                    <div className="flex items-center gap-4 rounded-card border border-border bg-card p-4">
                      <Avatar initials="MG" size="lg" tone="muted" status="online" />
                      <Avatar initials="MG" size="lg" tone="muted" status="away" />
                      <Avatar initials="MG" size="lg" tone="muted" status="offline" />
                    </div>
                  </div>
                </div>
              </DSVariants>

              <DSStates
                states={[
                  {
                    label: "Image OK",
                    node: (
                      <Avatar
                        src="https://i.pravatar.cc/96?img=47"
                        alt="Foto de perfil"
                        initials="MG"
                        size="lg"
                      />
                    ),
                  },
                  {
                    label: "Initials",
                    node: <Avatar initials="MG" tone="primary" size="lg" />,
                  },
                  {
                    label: "Image broken",
                    node: (
                      <Avatar
                        src="https://invalid.example.com/missing.jpg"
                        initials="MG"
                        tone="muted"
                        size="lg"
                      />
                    ),
                  },
                  {
                    label: "Placeholder",
                    node: <Avatar size="lg" tone="neutral" />,
                  },
                  {
                    label: "With status",
                    node: <Avatar initials="MG" tone="primary" size="lg" status="online" />,
                  },
                ]}
              />

              <DSCode snippet={AVATAR_CODE} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
    </>
  );
}
