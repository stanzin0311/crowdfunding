import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { MediaRenderer } from "@thirdweb-dev/react";
import { useSelector } from "react-redux";
import { useContractRead, useContractWrite } from "@thirdweb-dev/react";
import { Link } from "react-router-dom";

const Project = () => {
  let [Add, setAdd] = useState("");
  const { id } = useParams();

  let State = useSelector((state) => state.Reducer);
  const Data = useContractRead(State?.Contract, "AllCompaigns", [`${id}`], {
    from: Add,
  });
  const Donors = useContractRead(State?.Contract, "GetDonors", [`${id}`], {
    from: Add,
  });
  let [Load, setLoad] = useState(false);

  console.log(Data?.data);
  console.log(Donors?.data);
  useEffect(() => {
    let GetAdd = async () => {
      setAdd(await State?.Metamask?.getAddress());
    };
    State?.Contract && GetAdd();
  }, [State?.Contract]);

  const { mutateAsync: EndCompaign, isLoading: Loader2 } = useContractWrite(
    State?.Contract,
    "EndCompaign",
    {
      from: Add,
    }
  );
  const { mutateAsync: Donate, isLoading: Loader1 } = useContractWrite(
    State?.Contract,
    "Donate"
  );

  let DonateNow = async () => {
    try {
      const data = await Donate({ args: [id] });
      alert("Donation Success");
      setLoad(!Load);
    } catch (err) {
      alert("Something Went Wrong");
    }
  };
  let Abort = async () => {
    try {
      if (Data?.data[5] == Add) {
        const data = await EndCompaign({ args: [id] });
        alert("Contract Deleted Success");
        setLoad(!Load);
      } else {
        alert("Your Are Not Owner of This Compaign");
      }
    } catch (err) {
      alert("Something Went Wrong");
    }
  };

  useEffect(() => {}, [Load]);

  return (
    <div>
  <section className="flex flex-col justify-between h-[100vh]">
    <section className="h-[10%] m-2">
      <Header />
    </section>
    <section className="m-2 bg-white text-gray-800 p-4 rounded-md shadow-lg backdrop-blur-lg border border-gray-300 h-[100%] flex justify-between items-center gap-5">
      <Link
        to="/"
        className="p-2 bg-green-600 text-white rounded-md outline-none flex justify-center items-center absolute top-0 left-0 m-2 hover:bg-green-700 transition"
      >
        Home
      </Link>
      <div className="w-[50%] flex flex-col gap-5">
        <MediaRenderer
          src={Data?.data && Data?.data[2]}
          className="object-cover rounded-md shadow-md"
          height="50%"
          width="30%"
        />
        <div>
          <p className="font-semibold">List of Those Who Donated</p>
          <ul className="h-[20vh] overflow-y-scroll border border-gray-300 rounded-md p-2 bg-gray-100">
            {Donors?.data && Donors?.data.length > 0 ? (
              Donors?.data?.map((Each, Ind) => (
                <li key={Ind} className="text-gray-700">{Each}</li>
              ))
            ) : (
              <p className="text-gray-500">No Donors For Now</p>
            )}
          </ul>
        </div>
      </div>
      <div className="flex flex-col w-[50%] gap-5">
        <input
          type="text"
          className="bg-gray-200 rounded-md p-3 outline-none border border-gray-300"
          readOnly={true}
          value={Data?.data && "Name : " + Data?.data[0]}
        />
        <input
          type="text"
          className="bg-gray-200 rounded-md p-3 outline-none border border-gray-300"
          readOnly={true}
          value={Data?.data && "Story : " + Data?.data[1]}
        />
        <input
          type="text"
          className="bg-gray-200 rounded-md p-3 outline-none border border-gray-300"
          readOnly={true}
          value={Data?.data && "Target : " + Data?.data[3]}
        />
        <input
          type="text"
          className="bg-gray-200 rounded-md p-3 outline-none border border-gray-300"
          readOnly={true}
          value={Data?.data && "Total : " + Data?.data[7]}
        />
        {Loader1 ? (
          <div
            role="status"
            className="p-3 bg-green-600 text-white rounded-md flex justify-center items-center"
          >
            <svg
              aria-hidden="true"
              className="w-8 h-8 mr-2 text-gray-200 animate-spin fill-green-800"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124..."
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <button
            className="p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            onClick={DonateNow}
            disabled={Data?.data && Data?.data[6] == false ? true : false}
          >
            Donate
          </button>
        )}
        {Loader2 ? (
          <div
            role="status"
            className="p-3 bg-red-600 text-white rounded-md flex justify-center items-center"
          >
            <svg
              aria-hidden="true"
              className="w-8 h-8 mr-2 text-gray-200 animate-spin fill-red-800"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908..."
                fill="currentColor"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <button
            className="p-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            onClick={Abort}
            disabled={Data?.data && Data?.data[6] == false ? true : false}
          >
            Abort Campaign
          </button>
        )}
      </div>
    </section>
    <section className="h-[10%] m-2">
      <Footer />
    </section>
  </section>
</div>

  );
};

export default Project;
