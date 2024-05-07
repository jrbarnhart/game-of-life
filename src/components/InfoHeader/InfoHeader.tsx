const InfoHeader = ({ text, link }: { text: string; link: string }) => {
  return (
    <div className="w-full grid grid-flow-col items-center">
      <h1 className="text-lg md:text-2xl lg:text-4xl text-nowrap text-center font-bold">
        {text}
      </h1>
      <a
        href={link}
        target="_blank"
        rel="noreferrer noopener"
        className="ml-2 lg:ml-6 justify-self-end font-bold text-center text-sm lg:text-lg bg-neutral-700 w-6 lg:w-8 aspect-square rounded-full border-2 border-black focus:outline-none focus:ring-2 focus:ring-orange-500 hover:text-orange-400 hover:border-orange-400 active:bg-neutral-600 active:border-orange-500"
      >
        ?
      </a>
    </div>
  );
};

export default InfoHeader;
