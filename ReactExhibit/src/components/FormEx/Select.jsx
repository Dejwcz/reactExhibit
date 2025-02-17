import FieldsetWrapper from "./FieldsetWrapper";

const Select = ({ data, label, value, handleChange }) => {
  return (
    <FieldsetWrapper label={label}>
      <select
        className="form-select"
        id={label}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      >
        {data.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    </FieldsetWrapper>
  );
};

export default Select;
