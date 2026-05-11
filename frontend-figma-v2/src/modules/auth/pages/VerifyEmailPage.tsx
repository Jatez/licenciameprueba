import { Card, CardContent } from "@/components/ui/card";
import { VerifyEmail as VerifyEmailContent } from "@/modules/auth/components/VerifyEmail";

export default function VerifyEmail() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <VerifyEmailContent />
        </CardContent>
      </Card>
    </main>
  );
}
