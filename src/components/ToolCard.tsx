import { ArrowRight, LucideIcon } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon?: LucideIcon;
  popular?: boolean;
  comingSoon?: boolean;
}

export function ToolCard({
  title,
  description,
  href,
  icon: Icon,
  popular = false,
  comingSoon = false,
}: ToolCardProps) {
  return (
    <a
      href={href}
      className={`
        relative
        bg-white
        rounded-3xl
        border
        p-7
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        flex
        flex-col
        justify-between
        min-h-[190px]
        ${comingSoon ? "opacity-60 pointer-events-none" : ""}
      `}
    >
      {popular && (
        <div className="absolute top-5 right-5">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            Popular
          </span>
        </div>
      )}

      {comingSoon && (
        <div className="absolute top-5 right-5">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
            Em breve
          </span>
        </div>
      )}

      <div>
        {Icon && (
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
            <Icon
              size={24}
              className="text-green-600"
            />
          </div>
        )}

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          {title}
        </h3>

        <p className="text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-8 text-green-600 font-medium">
        {comingSoon ? (
          <>Disponível em breve</>
        ) : (
          <>
            Abrir ferramenta
            <ArrowRight size={18} />
          </>
        )}
      </div>
    </a>
  );
}
