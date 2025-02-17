import IntInput from "./IntInput";
import { useState } from "react";

const AquariumPlanner = ({ data }) => {
  const volumeRequired =
    data.filter((fish) => fish.type === "small").length * 10 +
    data.filter((fish) => fish.type === "big").length * 20;

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [length, setLength] = useState(0);

  let volume = Math.round((width / 10) * (height / 10) * (length / 10), 5);
  return (
    <div className="">
      <IntInput label="Width: " value={width} onChange={setWidth} />
      <IntInput label="Height: " value={height} onChange={setHeight} />
      <IntInput label="Length: " value={length} onChange={setLength} />
      <button
        className={
          volume > volumeRequired
            ? "btn btn-success d-flex mx-auto mb-3"
            : "btn btn-danger disabled d-flex mx-auto mb-3"
        }
      >
        Confirm
      </button>
      <div className="text-center border border-primary p-3 rounded-3 bg-primary-subtle fw-bold">
        <p>Required volume = {volumeRequired} l</p>
        <p>Calculated volume = {volume} l</p>
      </div>
    </div>
  );
};

export default AquariumPlanner;
