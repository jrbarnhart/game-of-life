const InfoHeader = () => {
  return (
    <div className="w-full grid grid-flow-col grid-cols-[1fr_min-content_1fr] items-center">
      <h1 className="col-start-2 pt-4 lg:pt-6 pb-2 text-2xl lg:text-4xl text-nowrap text-center font-bold">
        Conway&apos;s Game of Life
      </h1>
      <button className="col-start-3 mt-2 lg:mt-3 ml-2 lg:ml-6 justify-self-start font-bold text-sm lg:text-lg bg-neutral-700 w-6 lg:w-8 aspect-square rounded-full border-2 border-black focus:outline-none focus:ring-2 focus:ring-orange-500 hover:text-orange-400 hover:border-orange-400 active:bg-neutral-600 active:border-orange-500">
        <p className="">?</p>
      </button>
    </div>
  );
};

export default InfoHeader;
