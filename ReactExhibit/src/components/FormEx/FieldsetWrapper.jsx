const FieldsetWrapper = ({ label, children }) => {
  return (
    <fieldset className="border border-1 border-primary rounded-3 p-3 mb-1">
      <legend className="text-primary fw-bold">{label}</legend>
      {children}
    </fieldset>
  );
};

export default FieldsetWrapper;
