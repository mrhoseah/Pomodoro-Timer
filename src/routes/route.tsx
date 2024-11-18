import Timer from "../components/Timer";
import Analytics from "./analytics";

export default function Root() {
  return (
    <div className="bg-purple-900 flex justify-center  h-screen items-center">
      <div>
            <div className="grid grid-cols-2">
      <div>
        <Timer />
        </div>
      <div className="p-4 rounded-md bg-white shadow-sm">
        <Analytics />
      </div>
    </div>
     <p className="pt-32 text-center font-semibold text-white text-sm">&copy; mrhoseah</p>
      </div>
    </div>
  );
}
