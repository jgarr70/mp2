import './App.css'
import { useState } from "react";




type Fruit = {
  name: string;
  image: string;
  description: string;
};

function Card({fruit}: {fruit: Fruit}){
  return (
    <div>
      <h1>{fruit.name}</h1>
      <img src={fruit.image} alt={fruit.name} />
      <p>{fruit.description}</p>
    </div>
  );
}

function App() {
  
  const [layout, setLayout] = useState("grid");
  const [sortOption, setSortOption] = useState("");


  const fruits: Fruit[] = [
    {
      name: "Apple",
      image: "apple.jpg",
      description: "A red fruit"
    },
    {
      name: "Banana",
      image: "banana.jpg",
      description: "A yellow fruit"
    },
    {
      name: "Cherry",
      image: "cherry.jpg",
      description: "A small red fruit"
    },
    {
      name: "Date",
      image: "date.jpg",
      description: "A sweet brown fruit"
    },
    {
      name: "Elderberry",
      image: "elderberry.jpg",
      description: "A dark purple fruit"
    }
  ];

  const sortedFruits = [...fruits].sort((a, b) => {
    if (sortOption === "a-z") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "z-a") {
      return b.name.localeCompare(a.name);
    // } else if (sortOption === "year-asc") {
    //   return a.year - b.year;
    // } else if (sortOption === "year-desc") {
    //   return b.year - a.year;
    } else {
      return a.name.localeCompare(b.name);
    }
  }); 

  return (
    <>
      <section className="options">
        <button className="organize" onClick={() => setLayout("list")}>List</button>
        <button className="organize" onClick={() => setLayout("grid")}>Gallery</button>
        <input type="text" placeholder="Search.."/>
        <button className="filter">Filter</button>
      </section>
      <section className="options">
        <h3 className="filter">Sort:</h3>
          <select name="sort-options" id="sort-options" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
            <option value="year-asc">Year Ascending</option>
            <option value="year-desc">Year Descending</option>
          </select>
      </section>

      <div>{sortOption}</div>



      <hr />

      <section>
        <div className={layout}>
            {sortedFruits.map((fruit) => (<Card key={fruit.name} fruit={fruit} />))}
        </div>
      </section>

      <section id="next-steps">
        <div id="docs">
        </div>
        <div id="social">
          
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
