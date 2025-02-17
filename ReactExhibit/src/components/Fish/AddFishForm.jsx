import { useState } from "react";

const AddFishForm = ({ addFish }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("small");

  return (
    <div className="container col-md-6 d-flex flex-column text-center justify-content-center">
      <input
        className="form-control mb-1"
        type="text"
        placeholder="Jméno ryby"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select
        className="form-select mb-1"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="small">Small</option>
        <option value="big">Big</option>
      </select>
      <button
        className="btn btn-primary"
        onClick={() => {
          name && addFish({ name, type });
          setName("");
        }}
      >
        Add
      </button>
    </div>
  );
};

export default AddFishForm;
