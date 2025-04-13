import React, { useState, useEffect } from "react";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

import { useSelector } from "react-redux";
import { useContractRead } from "@thirdweb-dev/react";
import { MediaRenderer } from "@thirdweb-dev/react";
import { Link } from "react-router-dom";

const Account = () => {
  let [Add, setAdd] = useState("");

  let State = useSelector((state) => state.Reducer);
  const Data = useContractRead(State?.Contract, "GetAccount", [], {
    from: Add,
  });

  useEffect(() => {
    let GetAdd = async () => {
      setAdd(await State?.Metamask?.getAddress());
    };
    State?.Contract && GetAdd();
  }, [State?.Contract]);

  return (
    <div>
    <section className="flex flex-col justify-between h-[100vh] bg-white">
      {/* Header Section */}
      <section className="h-max m-2">
        <Header />
      </section>
  
      {/* Main Content */}
      <section className="m-2 bg-white/90 text-gray-800 p-4 rounded-md shadow-lg backdrop-blur-lg border border-gray-300 h-full sm:flex sm:justify-center flex sm:flex-row flex-col items-center">
        <Link
          to="/"
          className="p-2 bg-green-600 text-white rounded-md flex justify-center items-center absolute top-0 left-0 m-2 shadow-md hover:bg-green-700 transition"
        >
          Home
        </Link>
  
        {Data?.data && (
          <React.Fragment>
            {/* Image Box with Silver Background and Green Border */}
            <div className="object-cover h-[50%] w-[30%] rounded-md shadow-md border-2 border-green-500 bg-gray-300 flex justify-center items-center p-2">
              <MediaRenderer src={Data?.data[2]} className="w-full h-full rounded-md" />
            </div>
  
            <div className="flex flex-col gap-4">
              {/* Text Inputs with Silver Background and Green Border */}
              <input
                type="text"
                className="p-3 outline-none bg-gray-300 text-gray-800 px-5 rounded-md mx-5 border-2 border-green-500 shadow-sm"
                disabled
                value={Data?.data[0]}
              />
              <input
                type="text"
                className="p-3 outline-none bg-gray-300 text-gray-800 px-5 rounded-md mx-5 border-2 border-green-500 shadow-sm"
                disabled
                value={Data?.data[1]}
              />
              <input
                type="text"
                className="p-3 outline-none bg-gray-300 text-gray-800 px-5 rounded-md mx-5 border-2 border-green-500 shadow-sm"
                disabled
                value={Data?.data[3]}
              />
            </div>
          </React.Fragment>
        )}
      </section>
  
      {/* Footer Section */}
      <section className="h-[10%] m-2">
        <Footer />
      </section>
    </section>
  </div>
  
  );
};

export default Account;
