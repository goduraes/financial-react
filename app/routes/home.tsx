import AppBreadcrumb from "~/components/app-breadcrumb";

const Home = () => {
  return (
    <div className="flex flex-col gap-4">
      <AppBreadcrumb data={[{ text: 'Home' }]} />
    </div>
  );
}

export default Home;