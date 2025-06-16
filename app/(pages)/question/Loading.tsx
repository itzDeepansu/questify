import { CircleLoader } from "react-spinners";
export default function Loading() {
  return (
    <div className="bg-black flex justify-center items-center h-[100vh] w-[100vw] transition-all duration-1000">
      <CircleLoader color="#ffffff" loading={true} size={400} />
    </div>
  );
}
