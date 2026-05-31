import { IconLeafFilled } from "@tabler/icons-react";
import Column from "@components/placing/Column";

export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-main">
      <Column className="items-center gap-8">
        <Column className="items-center gap-3">
          <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-primary/10">
            <IconLeafFilled size={52} className="text-primary animate-pulse" />
          </div>
          <span className="text-3xl font-bold tracking-tight">EduGreen</span>
        </Column>

        <Column className="items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
          </div>
          <span className="text-sm text-secondary">Cargando...</span>
        </Column>
      </Column>
    </div>
  );
}
