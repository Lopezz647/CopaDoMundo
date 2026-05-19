import { Check, X, Users, Trophy, Crown } from "lucide-react";

const features = [
{ label: "Participantes", free: "Até 15", camisa: "Ilimitados", hexa: "Ilimitados", hexaHighlight: true },
{ label: "Anúncios", free: "Com anúncios", freeRed: true, camisa: "Com anúncios", hexa: "Sem anúncios", hexaHighlight: true },
{ label: "IA de notificações", free: true, camisa: true, hexa: true },
{ label: "Multiplicador de pontos", free: true, camisa: true, hexa: true },
{ label: "Logo da empresa", free: false, camisa: false, hexa: true },
{ label: "Autenticação de entrada", free: false, camisa: false, hexa: "Opcional", hexaHighlight: true },
{ label: "Banners personalizados", free: false, camisa: false, hexa: "Até 3 clicáveis", hexaHighlight: true },
{ label: "Personalização de cores", free: false, camisa: false, hexa: "Opcional", hexaHighlight: true },
{ label: "Suporte prioritário", free: false, camisa: false, hexa: true },
{ label: "Treinamento para equipe", free: false, camisa: false, hexa: "Opcional", hexaHighlight: true }];


function CellValue({ value, isHexa, isRed }) {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <div className={`${isHexa ? "bg-[#002776]/20" : "bg-emerald-500/20"} rounded-full p-1`}>
          <Check className={`h-4 w-4 ${isHexa ? "text-[#4169E1]" : "text-primary"}`} strokeWidth={3} />
        </div>
      </div>);

  }
  if (value === false) return <X className="h-4 w-4 text-destructive/50 mx-auto" />;
  return (
    <span className={`text-xs sm:text-sm font-medium ${isRed ? "text-destructive" : isHexa ? "text-[#4169E1]" : "text-foreground/70"}`}>
      {value}
    </span>);

}

export default function PlansComparison() {
  return null;























































}
