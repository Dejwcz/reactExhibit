import { useState } from "react";
import data from "./data";
import FieldsetWrapper from "./FieldsetWrapper";
import CheckBoxes from "./CheckBoxes";
import TextInput from "./TextInput";
import RadioButtons from "./RadioButtons";
import IntInput from "./IntInput";
import Select from "./Select";

const FormPractice = () => {
  const [checkedCBIds, setCheckedCBIds] = useState([]);
  const [otherWork, setOtherWork] = useState("");
  const [checkedRBId, setCheckedRBId] = useState(null);
  const [costEstimate, setCostEstimate] = useState(0);
  const [km, setKm] = useState(0);
  const [brand, setBrand] = useState("");

  const selectedServicesCost = data.checkBoxes
    .filter((cb) => checkedCBIds.includes(cb.id)) // 🔥 Vyfiltrujeme jen zaškrtnuté checkboxy
    .map((cb) => cb.price || 0) // 🔥 Ochrana proti `undefined`
    .reduce((acc, curr) => acc + curr, 0); // 🔥 Sečteme ceny

  const totalCost = Number(costEstimate) + selectedServicesCost;

  const selectedBrand =
    data.brands.find((b) => b.id === brand)?.label || "Vyberte značku";
  const selectedFuel =
    data.radioButtons.find((rb) => rb.id === checkedRBId)?.label || null;

  return (
    <div className="container">
      <div className="bg-success-subtle rounded-3 p-3 mt-3">
        <div className="row mx-auto mb-3 rounded-3 bg-success text-white">
          <h2 className="text-center fw-bold pt-3">Service Order</h2>
          <p>
            {data.checkBoxes
              .filter((cb) => checkedCBIds.includes(cb.id))
              .map((cb) => cb.label)
              .join(", ")}{" "}
            {otherWork === ""
              ? ""
              : checkedCBIds.length === 0
              ? otherWork
              : `+ ${otherWork}`}
          </p>
          <p>{`Cena: ${totalCost === 0 ? "0" : totalCost} Kč`}</p>
          <p>{`${
            selectedBrand === "Vyberte značku"
              ? ""
              : "Značka: " + selectedBrand + ", "
          }
              ${selectedFuel === null ? "" : "Pohon: " + selectedFuel + ", "}
              Najeto: ${km} km`}</p>
        </div>
        <div className="row row-cols-1 row-cols-md-2">
          <div className="col">
            <CheckBoxes
              data={data.checkBoxes}
              label={"Základní práce:"}
              checkedCBIds={checkedCBIds}
              onCBChange={setCheckedCBIds}
            />
            <div className="">
              <TextInput
                label={"Další práce:"}
                value={otherWork}
                setValue={(value) => setOtherWork(value)}
              />
              <FieldsetWrapper label={"Odhad ceny dalších prací:"}>
                <IntInput
                  label={""}
                  value={costEstimate}
                  onChange={setCostEstimate}
                />
              </FieldsetWrapper>
            </div>
          </div>
          <div className="col">
            <Select
              data={data.brands}
              label={"Značka:"}
              value={brand}
              handleChange={setBrand}
            />
            <RadioButtons
              label={"Pohon vozidla:"}
              data={data.radioButtons}
              groupName={"RBPalivo"}
              selectedRBId={checkedRBId}
              onRadioChange={setCheckedRBId}
            />
            <FieldsetWrapper label={"Najeté km:"}>
              <IntInput label="" value={km} onChange={setKm} />
            </FieldsetWrapper>
          </div>
        </div>
        <div className=""></div>
      </div>
    </div>
  );
};

export default FormPractice;
