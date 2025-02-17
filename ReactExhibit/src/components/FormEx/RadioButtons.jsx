import FieldsetWrapper from "./FieldsetWrapper";

const RadioButtons = ({
  data,
  label,
  groupName,
  selectedRBId,
  onRadioChange,
}) => {
  const handleChange = (e) => {
    onRadioChange(e.target.id);
  };

  return (
    <div>
      <FieldsetWrapper label={label}>
        {data.map((rb) => (
          <div key={rb.id} className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name={groupName}
              id={rb.id}
              checked={selectedRBId === rb.id}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor={rb.id}>
              {rb.label}
            </label>
          </div>
        ))}
      </FieldsetWrapper>
    </div>
  );
};

export default RadioButtons;
