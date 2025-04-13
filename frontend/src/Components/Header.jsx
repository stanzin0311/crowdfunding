import React, { useEffect, useState } from "react";
import { useMetamask } from "@thirdweb-dev/react";
import { useSelector, useDispatch } from "react-redux";
import { useContract } from "@thirdweb-dev/react";

const Header = () => {
  const connectWithMetamask = useMetamask();
  let [HeadState, setHeadState] = useState({
    Address: null,
    Balance: null,
  });
  let Dispatch = useDispatch();

  let { contract } = useContract('0xd34D612057ee13cbFeb4052811c4ea7fef381644');
  let ConnectWallet = async () => {
    connectWithMetamask().then(async (res) => {
      Dispatch({ type: "SetMetamask", payload: res });
      Dispatch({ type: "SetContract", payload: contract });

      setHeadState({
        ...HeadState,
        Address: await res?.getAddress(),
        Balance: await res?.getBalance(),
      });
    });
  };

  useEffect(() => {
    ConnectWallet();
  }, []);

  return (
    <div className="bg-white/80 p-4 text-gray-800 rounded-md shadow-lg backdrop-blur-lg border border-gray-300 flex sm:flex-row sm:justify-between sm:items-center flex-col gap-4 sm:gap-0">
    <p className="font-medium font-serif text-green-600 italic decoration-4 hover:underline">
      CODE_ZERO
    </p>
    <p className="bg-gray-100 text-gray-900 px-3 py-2 rounded-md border border-green-400 shadow-sm">
      Account: <span className="font-semibold">{HeadState?.Address}</span>{" "}
      <span className="text-gray-500">||</span> Balance{" "}
      <span className="font-semibold">
        {HeadState?.Balance?.displayValue?.slice(0, 5)}{" "}
        <span className="text-red-500">{HeadState?.Balance?.symbol}</span>
      </span>
    </p>
  </div>
  );
};

export default Header;
