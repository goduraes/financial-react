export const currencyFormat = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export const currencyFormatToNumber = (value: string) => {
  const onlyNumbers = value.replace(/\D/g, "");
  return Number(onlyNumbers) / 100;
}