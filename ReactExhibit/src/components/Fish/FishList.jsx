const FishList = ({ data, onDelete }) => {
  return (
    <div className="">
      {data.map((fish) => (
        <div
          key={fish.id}
          className="d-flex mx-auto justify-content-between col-md-6 mb-1 border border-primary p-2 rounded-2"
        >
          <span className="">
            <p>
              {fish.name} - {fish.type}
            </p>
          </span>
          <button onClick={() => onDelete(fish.id)} className="btn btn-danger">
            X
          </button>
        </div>
      ))}
    </div>
  );
};

export default FishList;
