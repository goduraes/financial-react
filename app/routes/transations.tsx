import AppBreadcrumb from "~/components/app-breadcrumb";

const Transations = () => {
  return (
    <div className="flex flex-col gap-4">
      <AppBreadcrumb data={[{ text: 'Transações' }]} />
    </div>
  );
}

export default Transations;