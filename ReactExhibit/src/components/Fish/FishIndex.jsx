import { useState } from "react";
import data from "./fishData.json";
import FishList from "./FishList";
import AddFishForm from "./AddFishForm";
import AquariumPlanner from "./AquariumPlanner";
import FieldsetWrapper from "./FieldsetWrapper";

const FishIndex = () => {
  const [listOfFish, setListOfFish] = useState(data.fish);
  const [activePage, setActivePage] = useState(1);

  const handleDelete = (idToDelete) => {
    const temp = listOfFish.filter((fish) => fish.id !== idToDelete);
    setListOfFish(temp);
  };

  const handleAdd = (newFish) => {
    const newId =
      listOfFish.length > 0
        ? Math.max(
            ...listOfFish.map((fish) => Number(fish.id.replace("fish", "")))
          ) + 1
        : 1;
    newFish.id = "fish" + newId;
    setListOfFish([...listOfFish, newFish]);
  };

  return (
    <div className="container col-md-10">
      <h1 className="mt-3 text-center">Aquarium</h1>
      <hr />
      <div className="d-flex justify-content-center gap-3 mb-3">
        <button
          className="btn btn-primary"
          name="fish-list"
          onClick={() => setActivePage(1)}
        >
          Fish List
        </button>
        <button
          className="btn btn-primary"
          name="aquarium"
          onClick={() => setActivePage(2)}
        >
          Aquarium Planner
        </button>
      </div>
      {activePage === 1 && (
        <>
          <FishList data={listOfFish} onDelete={handleDelete} />
          <FieldsetWrapper label="Add Fish">
            <AddFishForm addFish={handleAdd} />
          </FieldsetWrapper>
        </>
      )}
      {activePage === 2 && (
        <>
          <AquariumPlanner data={listOfFish} />
        </>
      )}
    </div>
  );
};

export default FishIndex;
