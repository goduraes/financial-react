import AppBreadcrumb from "~/components/app-breadcrumb";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { currencyFormat } from "~/helper/currency";

const cards = [
  { label: 'Resultado no período', value: 2000 },
  { label: 'Receitas', value: 4500, valueClass: 'text-green-600' },
  { label: 'Despesas', value: 2500, valueClass: 'text-destructive' },
]

const Home = () => {
  return (
    <div className="flex flex-col gap-4">
      <AppBreadcrumb data={[{ text: 'Home' }]} />    

      <div className="grid md:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <Card key={i} className="px-4" size="sm">
            <Label>{card.label}</Label>
            <span className={`font-bold text-xl lg:text-2xl ${card.valueClass}`}>{currencyFormat(card.value)}</span>
          </Card>  
        ))}
      </div>  
    </div>
  );
}

export default Home;