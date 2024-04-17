const InfoHeader = () => {
  return (
    <div className="w-full grid grid-flow-col grid-cols-[1fr_min-content_1fr] items-center">
      <h1 className="col-start-2 pt-4 pb-2 text-2xl text-nowrap text-center font-bold drop-shadow-lg shadow-black">
        Conway&apos;s Game of Life
      </h1>
      <button className="col-start-3 mt-2 ml-2 justify-self-start font-bold text-sm bg-neutral-700 w-6 aspect-square rounded-full border-2 border-black">
        <p className="">?</p>
      </button>
    </div>
  );
};

export default InfoHeader;
