import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useContractWrite,
  useStorageUpload,
  useContractRead,
  MediaRenderer,
} from "@thirdweb-dev/react";

const Body = () => {
  let [Menu, setMenu] = useState("All");
  let [File, setFile] = useState(null);
  let [FileURL, setFileURL] = useState(null);
  let [Add, setAdd] = useState("");

  let [Name, SetName] = useState("");
  let [Desc, SetDesc] = useState("");
  let [Target, SetTarget] = useState("");

  let State = useSelector((state) => state.Reducer);
  const { mutateAsync: CreateCompaign, isLoading } = useContractWrite(
    State?.Contract,
    "CreateCompaign"
  );
  const Data = useContractRead(State?.Contract, "GetUserCompaigns", [], {
    from: Add,
  });
  const AllCmps = useContractRead(State?.Contract, "GetAllCompaigns", [], {
    from: Add,
  });
  const { mutateAsync: upload } = useStorageUpload();

  useEffect(() => {
    if (AllCmps.data && AllCmps.data.length > 0) {
      console.log(AllCmps.data);
    }
  }, [AllCmps.data]);
  

  useEffect(() => {
    let GetAdd = async () => {
      setAdd(await State?.Metamask?.getAddress());
    };
    State?.Contract && GetAdd();
  }, [State?.Contract]);

  let Submit = () => {
    try {
      if (Name && Target && File && Desc) {
        let Upload = async () => {
          const dataToUpload = [File];
          const uris = await upload({ data: dataToUpload });
          return uris;
        };
        Upload().then(async (res) => {
          try {
            const data = await CreateCompaign({
              args: [Name, Desc, res[0], Target],
            }).then(() => {
              alert("Compaign Created Successfully");
              setMenu("Your");
            });
          } catch (err) {
            alert(err?.message);
          }
        });
      } else {
        alert("Please Fill All Fields");
      }
    } catch (err) {
      alert(err?.message);
    }
  };
  return (
<div className="bg-white text-[#333333] p-6 rounded-lg shadow-lg border border-gray-300 min-h-screen">
      {/* Navigation Menu */}
      <section className="border-b border-gray-400 flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 gap-y-6 sm:gap-y-0 w-full">
        <header>
          <span
            onClick={() => setMenu("Create")}
            className="rounded-lg px-4 py-2 cursor-pointer bg-[#008080] hover:bg-[#006666] transition-transform transform hover:scale-105 text-white font-semibold"
          >
            Create Campaign
          </span>
        </header>

        <header className="flex gap-x-10">
          <span
            onClick={() => setMenu("All")}
            className="rounded-lg px-4 py-2 cursor-pointer bg-[#008080] hover:bg-[#006666] transition-transform transform hover:scale-105 text-white font-semibold"
          >
            All Campaigns
          </span>
          <span
            onClick={() => setMenu("Your")}
            className="rounded-lg px-4 py-2 cursor-pointer bg-[#008080] hover:bg-[#006666] transition-transform transform hover:scale-105 text-white font-semibold"
          >
            Your Campaigns
          </span>
        </header>

        <header className="flex gap-x-4">
          <Link
            to="/signup"
            className="rounded-lg px-4 py-2 cursor-pointer bg-[#008080] hover:bg-[#006666] transition-transform transform hover:scale-105 text-white font-semibold"
          >
            SignUp
          </Link>
          <Link
            to="/account"
            className="rounded-lg px-4 py-2 cursor-pointer bg-[#008080] hover:bg-[#006666] transition-transform transform hover:scale-105 text-white font-semibold"
          >
            Account
          </Link>
        </header>
      </section>

      {/* Main Section */}
      <section className="p-4 w-full overflow-y-auto max-h-[calc(100vh-200px)]">
        {/* Your Campaigns */}
        {Menu === "Your" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Data?.data?.length > 10
              ? Data?.data?.slice(10).map((Each, Ind) => (
                  <Link
                    to={`/project/${Ind+10}`}
                    key={Ind+10}
                    className="p-4 flex flex-col gap-4 border border-gray-400 hover:bg-[#006666] transition-all rounded-lg bg-[#f0f9f9] text-[#333333]"
                  >
                    <MediaRenderer
                      src={Each[2]}
                      className="object-cover rounded-md w-full bg-gray-800"
                      height={100}
                    />
                    <p className="font-semibold text-lg leading-7 text-[#008080]">
                      {Each[0]}
                    </p>
                    <p className="font-medium text-sm leading-6 text-gray-600">
                      {Each[1]}
                    </p>
                  </Link>
                ))
              : "Empty"}
          </div>
        )}

        {/* All Campaigns */}
       {Menu === "All" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {AllCmps?.data?.length > 13
      ? AllCmps?.data?.slice(13).map((Each, Ind) => (
          <Link
            to={`/project/${Ind + 13}`} // Adjust index to reflect actual data
            key={Ind + 13}
            className="p-4 flex flex-col gap-4 border border-gray-400 hover:bg-[#006666] transition-all rounded-lg bg-[#f0f9f9] text-[#333333] relative"
          >
            <MediaRenderer
              src={Each[2]}
              className="object-cover rounded-md w-full bg-gray-800"
              height={100}
            />
            <p
              className={`absolute p-2 w-3 h-3 ${
                Each[6] === false ? "bg-red-500" : "bg-green-500"
              } rounded-full top-2 right-2`}
            ></p>
            <p className="font-semibold text-lg leading-7 text-[#008080]">
              {Each[0]}
            </p>
            <p className="font-medium text-sm leading-6 text-gray-600">
              {Each[1]}
            </p>
          </Link>
        ))
      : "Not enough campaigns"}
  </div>
)}


        {/* Create Campaign */}
        {Menu === "Create" && (
          <div className="cursor-pointer w-[50%] p-4 flex justify-center items-center rounded-lg flex-col gap-6 bg-[#f0f9f9] border border-[#008080] shadow-lg">
            <div className="sm:flex gap-6 w-[100%] sm:justify-center sm:items-center flex flex-col sm:flex-row">
              <section className="flex flex-col gap-5">
                {File && (
                  <img
                    src={FileURL}
                    alt="Uploaded File"
                    height={100}
                    width={100}
                    className="rounded-md border-2 border-[#008080] border-dashed h-[200px] w-[100%] object-contain p-1"
                  />
                )}
                <input
                  type="file"
                  className="input-field hidden"
                  onChange={({ target: { files } }) => {
                    files[0] && setFile(files[0]);
                    if (files) {
                      setFileURL(URL.createObjectURL(files[0]));
                    }
                  }}
                />
                <small
                  className="p-2 bg-[#008080] rounded-md w-[100%] text-center cursor-pointer text-white hover:bg-[#006666]"
                  onClick={() => document.querySelector(".input-field").click()}
                >
                  Select File
                </small>
              </section>

              <section className="flex flex-col gap-5">
                <input
                  type="text"
                  value={Name}
                  onChange={(E) => {
                    SetName(E.target.value);
                  }}
                  className="py-[15px] px-[15px] outline-none border-[1px] border-[#008080] bg-transparent text-[#333333] placeholder-gray-500 rounded-[10px] sm:min-w-[300px]"
                  placeholder="Project Name"
                />
                <input
                  type="text"
                  value={Desc}
                  onChange={(E) => {
                    SetDesc(E.target.value);
                  }}
                  className="py-[15px] px-[15px] outline-none border-[1px] border-[#008080] bg-transparent text-[#333333] placeholder-gray-500 rounded-[10px] sm:min-w-[300px]"
                  placeholder="Project Story"
                />
                <input
                  type="number"
                  value={Target}
                  onChange={(E) => {
                    SetTarget(E.target.value);
                  }}
                  className="py-[15px] px-[15px] outline-none border-[1px] border-[#008080] bg-transparent text-[#333333] placeholder-gray-500 rounded-[10px] sm:min-w-[300px]"
                  placeholder="Target Amount"
                />
                {isLoading ? (
                  <div className="p-3 bg-gray-400 rounded-xl text-white">
                    Loading...
                  </div>
                ) : (
                  <button
                    className="p-3 bg-[#008080] rounded-xl text-white hover:bg-[#006666]"
                    onClick={Submit}
                  >
                    Submit
                  </button>
                )}
              </section>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Body;
