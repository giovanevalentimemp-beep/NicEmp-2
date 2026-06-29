import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
}) {
  return (
    <Card className="rounded-lg border-dashed border-slate-300 shadow-none">
      <CardContent className="flex flex-col items-center justify-center p-10 text-center">
        {Icon ? <Icon className="mb-4 h-8 w-8 text-green-700" /> : null}
        <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{description}</p>
      </CardContent>
    </Card>
  );
}
