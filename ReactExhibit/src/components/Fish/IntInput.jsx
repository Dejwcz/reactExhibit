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
    <div className="d-flex my-3 align-items-center col-md-4 mx-auto">
      <label htmlFor={label} className="form-label me-3">
        {label}
      </label>
      <input
        className="form-control me-1"
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
      cm
    </div>
  );
};

export default IntInput;
