import './App.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link, useLocation } from 'react-router-dom';


type Movie = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  overview: string;
  vote_average: number;
};

function BackButton({index, sortedMovie}: {index: number, sortedMovie: Movie[]}) {
  const navigate = useNavigate();

return (
    <button 
      className="nav-button"
      onClick={() => navigate(
        `/movie/${sortedMovie[index - 1].id}`,
        {
          state: {
            index: index-1,
            sortedMovie: sortedMovie
          }
        }
      )}
    >
      <span>←</span> Back 
    </button>
  );
}

function ForwardButton({index, sortedMovie}: {index: number, sortedMovie: Movie[]}) {
  const navigate = useNavigate();

return (
    <button 
      className="nav-button"
      onClick={() => navigate(
        `/movie/${sortedMovie[index + 1].id}`,
        {
          state: {
            index: index+1,
            sortedMovie: sortedMovie
          }
        }
      )}
    >
      <span>→</span> Forward 
    </button>
  );
}

function DetailCard(){
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Movie>();

  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
      }
    })
    .then((response) => {
      console.log("API RESPONSE:", response.data);
      setData(response.data);
    })
    .catch((err) => {
      console.error("API ERROR:", err);
    });
  }, [id]); 

  const location = useLocation();

  return (
    
    <div className="detail-card-total">

      <div className = "buttons">
        <BackButton index={location.state?.index} sortedMovie={location.state?.sortedMovie}/>
        <button className="nav-button" onClick={() => navigate('/')}>Home</button>
        <ForwardButton index={location.state?.index} sortedMovie={location.state?.sortedMovie} />
      </div>

      <section className="detail-card">
        <div className="poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${data?.poster_path}`}
            alt={data?.title}
          />
        </div>
        <section className="movie-info">
          <h2>{data?.title}</h2>
          <p>Release Date: {data?.release_date}</p>
          <p>Rating: {data?.vote_average.toFixed(1)}</p>
          <p>{data?.overview}</p>
        </section>
      </section>
      
    </div>

  );
}

function Card({movie, index, sortedMovie}: {movie: Movie, index: number, sortedMovie: Movie[]}){
  return (
    <div className = "card">
      <section className="poster">
        <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        />
      </section>

      <section className = "movie-info">
        <div>
          <h2>{movie.title}</h2>
          <p>Release Date: {movie.release_date}</p>
          <p>Rating: {movie.vote_average.toFixed(1)}</p>
        </div>
        <Link to={`/movie/${movie.id}`} state={{
          index: index,
          sortedMovie: sortedMovie
        }}>Read the Synopsis</Link>
      </section>
    </div>
  );
}



function OrderMovies(data: Movie[], searchTerm: string, yearFilter: string, rankFilter: string, sortOption: string){

  const searchFilteredMovie = data.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMovie = searchFilteredMovie.filter((movie) => {
    if (yearFilter === "") {
      return true;
    } else {
      return movie.release_date.startsWith(yearFilter);
    }
  }); 
  const rankFilteredMovie = filteredMovie.filter((movie) => {
    if (rankFilter === "") {
      return true;
    } else {
      return movie.vote_average >= Number(rankFilter);
    }
  }); 

  const sortedMovie = [...rankFilteredMovie].sort((a, b) => {
    if (sortOption === "a-z") {
      return a.title.localeCompare(b.title);
    } else if (sortOption === "z-a") {
      return b.title.localeCompare(a.title);
    } else if (sortOption === "year-asc") {
      return a.release_date.localeCompare(b.release_date);
    } else if (sortOption === "year-desc") {
      return b.release_date.localeCompare(a.release_date);
    } else if (sortOption === "rank-asc") {
      return a.vote_average - b.vote_average;
    } else if (sortOption === "rank-desc") {
      return b.vote_average - a.vote_average;
    } else {
      return a.title.localeCompare(b.title);
    } 

  }); 
  return sortedMovie;
}

function Home() {

  console.log("HELLO FROM APP");
  
  const [layout, setLayout] = useState("grid");
  const [sortOption, setSortOption] = useState("");
  const [data, setData] = useState<Movie[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [yearFilter, setYearFilter] = useState("");
  const [rankFilter, setRankFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const sortedMovie = OrderMovies(data, searchTerm, yearFilter, rankFilter, sortOption);

  useEffect(() => {
    console.log("useEffect is running");

    axios.get("https://api.themoviedb.org/3/discover/movie", {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
      }
    })
    .then((response) => {
      console.log("API RESPONSE:", response.data);
      setData(response.data.results);
      console.log(
  response.data.results.map((movie: Movie) => movie.release_date)
);
    })
    .catch((err) => {
      console.error("API ERROR:", err);
    });

  }, []);

  return (
    <>
      <section className="header">
        <h1>Top Rated Movies</h1>
      </section>

      <section className="options">
        <button className="organize" onClick={() => setLayout("list")}>List</button>
        <button className="organize" onClick={() => setLayout("grid")}>Gallery</button>
        <input type="text" placeholder="Search.." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button className="filter" onClick={() => setFilterOpen(!filterOpen)}>Filter</button>
        <p className="filter">Sort:</p>
          <select name="sort-options" id="sort-options" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
            <option value="year-asc">Year Ascending</option>
            <option value="year-desc">Year Descending</option>
            <option value="rank-asc">Rank Ascending</option>
            <option value="rank-desc">Rank Descending</option>
          </select>
      </section>
      
      <section className="options">
        {filterOpen && (
          <div className="filter-menu">
            <div>
              <label htmlFor="year-filter">Release Year: </label>
              <select
                id="year-filter"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="">All Years</option>
                <option value="2026">2026</option>
                <option value="2021">2021</option>
                <option value="1985">1985</option>
                {/* <option value="2023">2023</option>
                <option value="2022">2022</option> */}
              </select>
            </div>
            <div>
              <label htmlFor="rank-filter">Ranking: </label>

              <select
                id="rank-filter"
                value={rankFilter}
                onChange={(e) => setRankFilter(e.target.value)}
              >
                <option value="">All Stars</option>
                <option value="10">10 Stars</option>
                <option value="9">9 Stars or higher</option>
                <option value="8">8 Stars or higher</option>
                <option value="7">7 Stars or higher</option>
                <option value="6">6 Stars or higher</option>
              </select>
            </div>
            
          </div>
        )}
      </section>
      <section className = "movie-cards">
        <div className={`movie-layout ${layout}`}>
            {sortedMovie.map((movie, index) => (<Card key={movie.id} movie={movie} index={index} sortedMovie={sortedMovie}/>))}
        </div>
      </section>
    </>
  )
}

function MovieDetail() {
  return (
    <div>
      <DetailCard/>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail/>} />
      </Routes>
    </BrowserRouter>
  );
  
}

export default App
