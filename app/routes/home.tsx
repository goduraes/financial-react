import { startOfMonth, lastDayOfMonth, format } from "date-fns";
import { Search } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import AppBreadcrumb from "~/components/app-breadcrumb";
import { DatePickerWithRange } from "~/components/date-picker-range";
import type { PeriodData } from "~/components/transations-filters";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";
import { currencyFormat } from "~/helper/currency";
import { useApi } from "~/hooks/useApi";
import { getSummary } from "~/services/dashboard";

export type Summary = {
  balance: number;
  total_expense: number;
  total_income: number;
}

const cards = [
  {
    label: "Resultado no período",
    prop: "balance",
    valueFunc: (val: number) => {
      if (val > 0) return "text-green-600";
      if (val < 0) return "text-destructive";
      return '';
    },
  },
  { label: "Receitas", prop: "total_expense", valueClass: "text-green-600" },
  { label: "Despesas", prop: "total_income", valueClass: "text-destructive" },
];

const Home = () => {
  const ran = useRef(false);
  const { request } = useApi();
  const [period, setPeriod] = useState<PeriodData>({
    from: startOfMonth(new Date()), 
    to: lastDayOfMonth(new Date())
  });
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  const [summary, setSummary] = useState<Summary>();

  const getSummaryInfo = async (period: PeriodData) => {
    setLoadingSummary(true);
    const startDate = period.from ? format(period.from, 'yyyy-MM-dd') : '';
    const endDate = period.to ? format(period.to, 'yyyy-MM-dd') : '';
    
    try {
      const summary = await request(() => getSummary(startDate, endDate), true, false);
      if (summary && summary.data) setSummary(summary.data);
    } catch (e) {}
    finally {
      setLoadingSummary(false);
    }
  };
  
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    getSummaryInfo(period);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <AppBreadcrumb data={[{ text: 'Home' }]} /> 

      <div className="flex justify-end gap-4 w-full">
        <div className="w-full md:w-1/2 lg:w-1/3 xl:w-64">
          <DatePickerWithRange
            value={period}
            onChange={(val) => {
              if (!val || !val.from) return;
              setPeriod({ from: val.from, to: val.to });
            }}
          />
        </div>

        <Button size="icon" variant="outline" className="cursor-pointer" onClick={() => getSummaryInfo(period)}>
          <Search />
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {cards.map((card, i) => {
          const value = summary && summary[card.prop as keyof Summary] ? summary[card.prop as keyof Summary] : 0;
          const valueFuncClass = card.valueFunc ? card.valueFunc(value) : '';
          
          return (
            <Card key={i} className="px-4" size="sm">
              <Label>{card.label}</Label>
              <span className={`font-bold text-xl lg:text-2xl ${valueFuncClass} ${card.valueClass}`}>
                {loadingSummary ? <Skeleton className="h-4 w-full h-7" /> : currencyFormat(value)}
              </span>
            </Card>  
        )})}
      </div>
    </div>
  );
}

export default Home;