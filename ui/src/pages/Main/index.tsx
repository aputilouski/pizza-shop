import MenuSection from './MenuSection';

const MainPage = () => {
  return (
    <div>
      <p className="font-bold text-4xl text-center">Menu</p>

      <MenuSection title="Pizza" />

      <h4 className="text-2xl border-solid border-0 border-b">Starters</h4>
      <h4 className="text-2xl border-solid border-0 border-b">Chicken</h4>
      <h4 className="text-2xl border-solid border-0 border-b">Desserts</h4>
      <h4 className="text-2xl border-solid border-0 border-b">Drinks</h4>
    </div>
  );
};

export default MainPage;
