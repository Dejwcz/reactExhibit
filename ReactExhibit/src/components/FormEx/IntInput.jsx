const IntInput = ({ label, value, onChange }) => {
  const handleChange = (e) => {
    let newValue = e.target.value.replace(/\D/g, "");
    newValue = newValue.replace(/^0+/, "");
    if (newValue === "") {
      newValue = "0";
    }

    onChange(newValue);
  };
  return (
    <>
      <label htmlFor={label} className="form-label">
        {label}
      </label>
      <input
        className="form-control"
        type="text"
        id={label}
        step={1}
        min={0}
        value={value}
        onChange={handleChange}
        onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
        onPaste={(e) => {
          e.preventDefault();
          const pastedValue = e.clipboardData
            .getData("text")
            .replace(/\D/g, "");
          onChange(pastedValue);
        }}
      />
    </>
  );
};

export default IntInput;
