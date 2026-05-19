import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const planConfig = {
  gratuito: { label: "GRATUITO", max: 15, pricePerPerson: 0 },
  camisa10: { label: "CAMISA 10", max: 500, pricePerPerson: 1.75 },
  hexa: { label: "HEXA", max: 1000, pricePerPerson: 6.07 }
};

export default function PriceSimulator() {
  const [plan, setPlan] = useState("camisa10");
  const [people, setPeople] = useState(20);
  const cfg = planConfig[plan];
  const total = plan === "gratuito" ? 0 : people * cfg.pricePerPerson;

  return null;







































































}
