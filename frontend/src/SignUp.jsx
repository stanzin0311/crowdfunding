import React, { useState } from "react";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { useStorageUpload, useContractWrite } from "@thirdweb-dev/react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SignUp = () => {
  let State = useSelector((state) => state.Reducer);

  let [File, setFile] = useState(null);
  let [FileURL, setFileURL] = useState(null);

  let [Name, SetName] = useState("");
  let [Age, SetAge] = useState("");

  const { mutateAsync: upload } = useStorageUpload();
  const { mutateAsync: CreateAccount, isLoading } = useContractWrite(
    State?.Contract,
    "CreateAccount"
  );
  let Submit = async () => {
    try {
      if (Name && Age && File) {
        let Upload = async () => {
          const dataToUpload = [File];
          const uris = await upload({ data: dataToUpload });
          return uris;
        };
        Upload().then(async (res) => {
          try {
            const data = await CreateAccount({
              args: [Name, res[0], Age],
            }).then(() => {
              alert("Account Created Successfully");
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
    <div>
    <section className="flex flex-col justify-between h-[100vh] bg-white">
      {/* Header Section */}
      <section className="h-max m-2">
        <Header />
      </section>
  
      {/* Main Content */}
      <section className="m-2 bg-white/90 text-gray-800 p-4 rounded-md shadow-lg backdrop-blur-lg border border-gray-300 h-full flex justify-center items-center">
        <Link
          to="/"
          className="p-2 bg-green-600 text-white rounded-md flex justify-center items-center absolute top-0 left-0 m-2 shadow-md hover:bg-green-700 transition"
        >
          Home
        </Link>
  
        <div className="cursor-pointer w-[50%] p-4 flex justify-center items-center rounded-lg flex-col gap-5">
          <div className="flex flex-col gap-5 w-full">
            {/* Image Box with Silver Background and Green Border */}
            {File && (
              <div className="rounded-md border-2 border-green-500 bg-gray-300 flex justify-center items-center h-[200px] w-full p-1">
                <img src={FileURL} alt="Uploaded File" className="h-full w-auto object-contain" />
              </div>
            )}
            
            <input
              type="file"
              className="input-field hidden"
              onChange={({ target: { files } }) => {
                if (files && files[0]) {
                  setFile(files[0]);
                  setFileURL(URL.createObjectURL(files[0]));
                }
              }}
            />
            <small
              className="p-2 bg-red-500 text-white rounded-md w-full text-center cursor-pointer hover:bg-red-600 transition"
              onClick={() => document.querySelector(".input-field").click()}
            >
              Select File
            </small>
  
            {/* Input Fields with Silver Background & Green Border */}
            <input
              type="text"
              value={Name}
              onChange={(E) => SetName(E.target.value)}
              className="outline-none p-3 rounded-md bg-gray-300 text-gray-800 border-2 border-green-500 shadow-sm w-full"
            />
            <input
              type="number"
              value={Age}
              onChange={(E) => SetAge(E.target.value)}
              className="outline-none p-3 rounded-md bg-gray-300 text-gray-800 border-2 border-green-500 shadow-sm w-full"
            />
  
            {/* Submit Button with Loading Indicator */}
            {isLoading ? (
              <div role="status" className="p-3 bg-green-500 text-white rounded-md flex justify-center items-center shadow-md">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <button
                className="p-3 bg-green-600 text-white rounded-md shadow-md w-full hover:bg-green-700 transition"
                onClick={Submit}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </section>
  
      {/* Footer Section */}
      <section className="h-[10%] m-2">
        <Footer />
      </section>
    </section>
  </div>
  
  );
};

export default SignUp;
