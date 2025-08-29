export default function NavBar() {
  return (
    <>
      <div className="fixed wrapper flex border-2 p-2 w-[1200px] max-w-[90%] rounded-xl justify-between left-1/2 -translate-x-1/2 top-[40px] ">
        <div className="left-red-div flex  px-1 py-2 items-center mr-2  ">
          <img
            loading="lazy"
            src="https://cdn.prod.website-files.com/6826235ef861ed9464b064c8/6826235ef861ed9464b06541_logo.svg"
            alt=""
            className="navbar14_logo mx-2 h-[3em] mr-5"
          ></img>
          <div className="flex flex-col">
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              mapGPT
            </h1>
          </div>
        </div>
        <div
          className=" flex border-4
                    border-blue-500 "
        >
            
        </div>
      </div>
    </>
  );
}
