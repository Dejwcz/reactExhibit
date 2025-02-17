const FieldsetWrapper = ({ label, children }) => {
  return (
    <fieldset className="border border-1 border-primary rounded-3 p-3 mb-1 col-md-6 mx-auto">
      <legend className="text-primary fw-bold text-center">{label}</legend>
      {children}
    </fieldset>
  );
};

export default FieldsetWrapper;
