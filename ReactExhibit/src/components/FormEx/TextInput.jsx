import FieldsetWrapper from "./FieldsetWrapper";

const TextInput = ({ label, value, setValue }) => {
  return (
    <div>
      <FieldsetWrapper label={label}>
        <textarea
          className="form-control"
          type="text-area"
          value={value}
          rows="4"
          onChange={(e) => setValue(e.target.value)}
        />
      </FieldsetWrapper>
    </div>
  );
};

export default TextInput;
