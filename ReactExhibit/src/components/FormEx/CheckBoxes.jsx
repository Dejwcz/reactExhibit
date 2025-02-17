import FieldsetWrapper from "./FieldsetWrapper";

const CheckBoxes = ({ data, label, checkedCBIds, onCBChange }) => {
  const handleChange = (e) => {
    const { id, checked } = e.target;
    const updatedCheckedIds = checked
      ? [...checkedCBIds, id]
      : checkedCBIds.filter((cbId) => cbId !== id);
    onCBChange(updatedCheckedIds);
  };

  return (
    <FieldsetWrapper label={label}>
      {data.map((checkBox) => (
        <div key={checkBox.id} className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id={checkBox.id}
            name={checkBox.name}
            checked={checkedCBIds.includes(checkBox.id)}
            onChange={handleChange}
          />
          <label htmlFor={checkBox.id} className="form-check-label w-100">
            <div className="d-flex justify-content-between">
              <div>{checkBox.label}</div>
              <div className="text-nowrap">{`${checkBox.price} Kč`}</div>
            </div>
          </label>
        </div>
      ))}
    </FieldsetWrapper>
  );
};

export default CheckBoxes;
