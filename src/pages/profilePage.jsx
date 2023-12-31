import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { NavBar, Footer } from "../components";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, updateProfile } from "firebase/auth";
import app from "../utils/firebase.init";
import { useGetData } from "../hooks/useGetData";
import {
  FaArrowLeft,
  FaArrowRight,
  FaChalkboardTeacher,
  FaEdit,
  FaEnvelope,
  FaTransgender,
  FaUser,
} from "react-icons/fa";

import { Edit } from "@mui/icons-material";

import { BsTelephoneFill } from "react-icons/bs";
import { useRef } from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import { usePutData } from "../hooks/usePutData";
import { useEffect } from "react";
import teaching from "../assets/teaching.svg";
import admin from "../assets/admin.svg";
const auth = getAuth(app);
const ProfilePage = () => {
  const [user] = useAuthState(auth);
  const { iframeReadOnly, setIframeReadonly } = useState(true);
  const localImageRef = useRef();
  const {
    data: student,
    isLoading: loading,
    refetch,
    error,
  } = useGetData(`/user?email=${user?.email}`);
  console.log(error);
  const [imageUploading, setImageUploading] = useState(false);
  const [image, setImage] = useState("");
  const { mutate: imageUpdate } = usePutData(
    `/update/user/profile/image?email=${user?.email}`
  );
  const handleIframe = () => {
    setIframeReadonly((prev) => !prev);
  };
  const uploadImage = async () => {
    setImageUploading(true);
    const localImage = localImageRef.current.files[0];

    if (localImage) {
      try {
        const formData = new FormData();
        formData.append("image", localImage);

        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_IMAGEBB_KEY
          }`,
          { method: "POST", body: formData }
        );

        if (response.ok) {
          const data = await response.json();

          if (data && data.data && data.data.display_url) {
            const imageUrl = data.data.display_url;

            await updateProfile(user, {
              photoURL: imageUrl || null,
            });

            imageUpdate({ image: imageUrl });
            setImageUploading(false);
            refetch();
          } else {
            throw new Error("Failed to upload image or retrieve URL.");
          }
        } else {
          throw new Error("Image upload request failed.");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setImageUploading(false);
      }
    }
  };

  const { data: totalSelected, isLoading: selectedLoading } = useGetData(
    `/user/selectedClass?email=${user?.email}`
  );
  const { data: enrolledCount, isLoading: enrolledLoading } = useGetData(
    `/payment/history?email=${user.email}`
  );
  const enrolledTotal = enrolledCount?.count;
  const {
    mutate,

    isError,
  } = usePutData(`/update/user?email=${user?.email}`);

  const handleUpdateProfileStudent = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const address = form.address.value;
    const number = form.number.value;
    const gender = form.gender.value;
    const iframe = form.iframe.value;
    console.log(name, address, number, gender);
    mutate({
      name: name,
      iframe: iframe,
      address: address,
      number: number,
      gender: gender,
    });
    await updateProfile(user, {
      displayName: name,
      phoneNumber: number,
    });
    if (!isError) {
      refetch();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Profile Updated Successfully!",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          popup: "custom-swal-container",
          icon: "custom-swal-icon",
        },
      });
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Profile Update Failed!",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          popup: "custom-swal-container",
          icon: "custom-swal-icon",
        },
      });
    }
  };
  const {
    data: qa,
    isLoading: qaLoading,
    refetch: qaRefetch,
  } = useGetData(`/user/question-answer?email=${user?.email}`);
  useEffect(() => {
    qaRefetch();
  }, []);
  const role = localStorage.getItem("role");
  const userRole = student && student[0]?.role;
  console.log(student ? student : "");
  return (
    <div className="bg-dark">
      <NavBar isBlack />
      <Divider />

      <main className="  bg-dark">
        <section className="relative block h-500-px">
          <div
            className="absolute top-0 w-full h-full   bg-center bg-cover"
            style={{
              backgroundImage:
                'url("https://i.ibb.co/mCzB6Xv/order-of-the-planets.jpg")',
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full left-0 absolute opacity-50 bg-black"
            ></span>
          </div>
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
            style={{ transform: "translateZ(0px)" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-gray-200 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </section>
        <section className="relative pt-16 bg-dark">
          <div
            className="container mx-auto  px-4"
            style={{ boxShadow: "none" }}
          >
            <div className="relative flex flex-col  min-w-0 break-words bg-lightCard w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                    <div className="relative w-44 overflow-hidden flex justify-center items-center object-cover rounded-full border-4 object-top   border-purple-600 h-44 -mt-20 md:-mt-16">
                      <img
                        alt="..."
                        src={
                          !loading
                            ? student[0]?.image
                            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFqo3RO1_w9lL_-wI2wmq3EFZroPIq1N_O1Kya335faA&s"
                        }
                        style={{ objectPosition: "top" }}
                        className="shadow-xl  top-0 scale-110 object-fill bg-center align-middle border-none  absolute  h-auto w-full"
                      />{" "}
                      <div className=" items-center   py-2 px-6 absolute -bottom-2 flex justify-center">
                        <div className="input-box ">
                          <div
                            className="flex items-center 
                           px-6 rounded w-full justify-center"
                          >
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer w-full  py-2   shadow-lg"
                            >
                              {" "}
                              <span className="text-lg  flex items-center justify-center gap-2 text-gray-100">
                                {!image ? (
                                  <>
                                    {imageUploading ? (
                                      <span className="flex text-gray-100 gap-4 items-center">
                                        <CircularProgress
                                          sx={{
                                            color: "#9333ea",
                                            width: 2,
                                            height: 2,
                                          }}
                                        />
                                      </span>
                                    ) : (
                                      <FaEdit className="w-full bg-lightCard px-6 rounded home text-xl" />
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <FaEdit className="w-full bg-lightCard px-6 rounded home text-xl" />
                                  </>
                                )}
                              </span>
                              <input
                                id="file-upload"
                                type="file"
                                className="hidden z-10  w-full"
                                accept="image/*"
                                onChange={uploadImage}
                                ref={localImageRef}
                                name="localImage"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-full lg:w-4/12 my-16 px-2 lg:order-3  lg:text-right flex-col rounded lg:flex ${
                      role && userRole === "student" ? "h-44" : "h-auto"
                    } overflow-y-auto  justify-start  items-start lg:self-center`}
                  >
                    {role && userRole === "student" ? (
                      <>
                        <h1 className="absolute top-10 text-gray-400">Q&A</h1>
                        {!qaLoading ? (
                          <div className="">
                            {qa?.map((item, indx) => (
                              <div
                                key={indx}
                                className="flex flex-col border-2  border-gray-600 px-8 py-4 my-2 rounded-lg "
                              >
                                <h1 className="text-xs flex flex-col my-2 justify-end text-end text-gray-200">
                                  <span className="w-full my-2 flex text-end justify-end gap-2 items-center text-green-400">
                                    me
                                    <img
                                      src={item?.user?.photoURL}
                                      className="w-6 rounded-full h-6"
                                      alt=""
                                    />{" "}
                                  </span>
                                  <span className="flex w-full items-center gap-2 justify-end">
                                    {item?.question}
                                    <FaArrowLeft className="text-green-500" />
                                  </span>
                                </h1>
                                <div className="w-full flex text-start items-center gap-2 text-purple-400 text-sm ">
                                  <img
                                    src={item?.instructor?.image}
                                    className="w-6 rounded-full h-6"
                                    alt=""
                                  />
                                  {item?.instructor?.name}
                                </div>
                                <div className="text-start flex items-center gap-2 my-2 justify-start  relative text-gray-300 text-xs">
                                  <FaArrowRight className="text-purple-500" />
                                  {item?.answer ? (
                                    item?.answer
                                  ) : (
                                    <span className="flex justify-start text-start  w-full items-start ">
                                      Pending...
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <h1 className="text-gray-400 flex justify-center items-center mx-auto">
                            No Data
                          </h1>
                        )}
                      </>
                    ) : (
                      <div className="w-full flex flex-col gap-2  text-purple-500">
                        <span className="my-2 headline">
                          Welcome Back
                          <span className="px-2">
                            {role && userRole === "instructor"
                              ? "Instructor"
                              : role && userRole === "admin"
                              ? "Admin"
                              : ""}
                          </span>
                        </span>
                        <img
                          src={
                            role && userRole === "instructor"
                              ? teaching
                              : role && userRole === "admin"
                              ? admin
                              : ""
                          }
                          alt=""
                        />
                      </div>
                    )}
                  </div>
                  <div className="w-full lg:w-4/12 px-4 pt-4 lg:order-1">
                    <div className="flex justify-start flex-wrap  text-gray-200 pb-2 lg:pt-4 ">
                      <div className="mr-4 p-3 text-center">
                        <span className="text-sm md:text-xl font-bold block uppercase tracking-wide text-gray-300">
                          {(!selectedLoading && totalSelected?.length) || 0}
                        </span>
                        <span className="text-sm text-gray-200">
                          You Selected
                        </span>
                      </div>
                      <div className="mr-4 p-3 text-center">
                        <span className="text-sm md:text-xl font-bold block uppercase tracking-wide text-gray-300">
                          {!enrolledLoading && enrolledTotal}
                        </span>
                        <span className="text-sm text-gray-200">Enrolled</span>
                      </div>
                    </div>
                    <div className="text-start mb-12">
                      <h3 className="text-4xl font-semibold leading-normal  text-gray-200 mb-2">
                        {!loading && <>{student[0]?.name}</>}
                      </h3>
                      <div className="text-sm leading-normal mt-0 mb-2 text-gray-300 font-bold ">
                        <span className="flex mx-auto justify-start items-center gap-2">
                          <FaEnvelope className="text-gray-300" />
                          {!loading && <>{student[0]?.email} </>}
                        </span>
                      </div>
                      <div className="text-sm leading-normal mt-0 mb-2 text-gray-300 font-bold uppercase">
                        <i className="fas fa-map-marker-alt mr-2 text-lg text-gray-300"></i>
                        {!loading && (
                          <>
                            {student[0]?.address
                              ? student[0]?.address
                              : "Unknown"}{" "}
                          </>
                        )}
                      </div>
                      <div className="text-sm leading-normal flex items-center gap-2 mt-0 mb-2 text-green-500 font-bold uppercase">
                        <FaChalkboardTeacher />
                        {!loading && <>{student[0]?.role}</>}
                      </div>
                      <div className="text-sm leading-normal flex items-center gap-2 mt-0 mb-2 text-purple-500 font-bold uppercase">
                        <FaTransgender />

                        {!loading && <>{student[0]?.gender}</>}
                      </div>
                    </div>
                  </div>
                </div>
                <Accordion sx={{ padding: 0 }}>
                  <AccordionSummary
                    expandIcon={
                      <Edit
                        sx={{ backgroundColor: "#1b2640", color: "#a855f7" }}
                      />
                    }
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{ backgroundColor: "#1b2640", color: "#fff" }}
                  >
                    <Typography
                      sx={{
                        display: "flex",
                        fontSize: { sm: "sm", md: "lg" },
                        alignItem: "center",
                      }}
                    >
                      {!loading && <>{student[0]?.name}</>}
                      <span className="px-2 text-gray-400">
                        Update Your Profile
                      </span>
                      <span className="text-purple-500 flex items-center gap-2 px-2"></span>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      backgroundColor: "#1b2640",
                      color: "#fff",
                    }}
                  >
                    <div
                      className="w-full py-16 relative home  rounded-xl filter "
                      style={{
                        backgroundPosition: "top left",
                      }}
                    >
                      <form
                        onSubmit={handleUpdateProfileStudent}
                        className="flex  z-50  py-12 flex-col gap-4"
                      >
                        <div className="flex flex-col gap-4">
                          <div className=" items-center z-50 gap-6 rounded-full  flex px-5">
                            <FaUser className="text-white" />
                            <input
                              type="text"
                              name="name"
                              className="px-5 w-full rounded-full bg-transparent"
                              placeholder="Update your name*"
                              required
                              defaultValue={student ? student[0]?.name : ""}
                            />
                          </div>
                          <div className=" px-5 z-50 flex gap-6 items-center">
                            <i className="fas fa-map-marker-alt  text-lg text-gray-300"></i>

                            <input
                              type="text"
                              placeholder="Update your address*"
                              name="address"
                              className="px-5 bg-transparent rounded-full w-full"
                              defaultValue={student ? student[0]?.address : ""}
                              required
                            />
                          </div>
                          <div className="flex w-full flex-col gap-4 md:gap-. md:flex-row  items-center px-5 z-50 ">
                            <div className="flex gap-6 items-center w-full ">
                              <BsTelephoneFill className="text-gray-100" />
                              <input
                                type="number"
                                name="number"
                                className="px-5 rounded-full w-full bg-transparent"
                                placeholder="Update phone number "
                                defaultValue={
                                  student ? student[0]?.contactNumber : ""
                                }
                              />
                            </div>
                            <div className="w-full flex items-center gap-6   relative ">
                              <label className="font-semibold right-10 top-0 absolute text-[#9ca3af] text-xs  py-1">
                                Update Gender
                              </label>
                              <FaTransgender />
                              <select
                                name="gender"
                                className="text-purple-500 bg-lightCard rounded-full bg-transparent h-[50px] font-semibold  outline-none text-md   block w-full px-6"
                                defaultValue={student ? student[0]?.gender : ""}
                              >
                                <option>male</option>
                                <option value="female">female</option>
                                <option value="custom">custom</option>
                              </select>
                            </div>
                          </div>
                          {role && userRole === "instructor" && (
                            <>
                              <label className="bg-dark py-2 text-xs">
                                Update iframe for intro video in instructor
                                profile
                              </label>
                              <textarea
                                rows={10}
                                name="iframe"
                                className="bg-black text-start  p-4 mx-6 text-white z-50 border-none outline-none"
                                cols={50}
                                defaultValue={
                                  !loading && student[0]?.iframe
                                    ? student[0]?.iframe
                                    : "Add iframe from youtube for intro video"
                                }
                              />
                            </>
                          )}
                          <button
                            type="submit"
                            className="bg-purple-600 z-50 px-6 py-4 rounded-full"
                          >
                            Update
                          </button>

                          {/* {error && <h2 className="text-red-500">{error}</h2>} */}
                        </div>
                      </form>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer isDarkMode />
    </div>
  );
};

export default ProfilePage;
