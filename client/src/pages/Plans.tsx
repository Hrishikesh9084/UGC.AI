import PricingPage from "../pages/pricingPage";

const Plans = () => {
  return (
    <div className="max-sm:py-10">
       <PricingPage />
      <p className="text-center text-gray-400 max-w-md text-sm my-14 mx-auto">
        Create stunning images for just{" "}
        <span className="text-indigo-400">5 credits</span> and generate
        immersive video for <span className="text-indigo-400">10 credits</span>.
      </p>
    </div>
  );
};

export default Plans;
