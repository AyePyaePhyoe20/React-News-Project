import { Fragment, useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(
    function () {
      async function getFact() {
        setIsLoading(true);
        let query = supabase.from("fact").select("*");

        if (currentCategory !== "all")
          query = query.eq("category", currentCategory);
        const { data: fact, error } = await query.limit(1000);
        setFacts(fact);
        setIsLoading(false);
      }
      getFact();
    },
    [currentCategory]
  );

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowform={setShowForm} />
      ) : null}

      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? <Loader /> : <FactList facts={facts} />}
      </main>
    </>
  );
}

function Header({ showForm, setShowForm }) {
  const appTitle = "React  project";
  return (
    <header className="header">
      <div className="logo">
        <img src="./logo.png" width="68px" height="68px" />
        <h1>{appTitle}</h1>
      </div>
      <button
        class="btn btn-large btn-open"
        onClick={() => setShowForm((show) => !show)}
      >
        {showForm ? "Close" : "Share A Face"}
      </button>
    </header>
  );
}
// function counter(){
//   const [count,setCount]=useState(10);
//   console.log(x);
//   return(
//   <div>
//     <span style={{fontSize:"40px"}}>{count}</span>
//     <button className="btn btn-large" onClick={()=> setCount((c)=>c+1)}>+</button>
//   </div>
//   );
// }

function Loader() {
  return <span className="message">Loading...</span>;
}

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");

  const textLenget = text.length;

  function isValidHttpUrl(string) {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }

  async function handleSubmit(e) {
    //to stop default browser update
    e.preventDefault();

    //userထည့်တဲ့ dataတွေ formထဲ ပါ/မပါ စစ်ပီး ပါရင် factအသစ်ဆောက်ရန်

    if (text && isValidHttpUrl(source) && category && textLenget <= 200) {
      //fact အသစ်ကို fact object အဖြစ်ပြောင်းရန်

      //Supabase database ထဲ factအသစ်ထည့်မယ် ပီး fact object အသစ်ထုတ်

      const { data: newFact, error } = await supabase
        .from("fact")
        .insert([{ text, source, category }])
        .select();
      // const newFact = {
      //   id: Math.round(Math.random() * 100000),
      //   text: text,
      //   source: source,
      //   category: category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };

      //fact object ကို UI မှာ ပြရင် fact state အသစ်တစ်ခုရေးရန်
      setFacts((currentFacts) => [newFact, ...currentFacts]);

      //form ထဲက dataတွေကို အကုန်ဖျက်ရန်
      setText("");
      setSource("");
      setCategory("");

      //form ပြန်ပိတ်ရန်
      setShowForm(false);
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the words...."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <span className="counting-words">{200 - textLenget}</span>
      <input
        type="text"
        placeholder="Trustworthy Sorce...."
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />
      <select
        name=""
        id=""
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Choose Categories:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button class="btn btn-large">Post</button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-category"
            onClick={() => setCurrentCategory("all")}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              onClick={() => setCurrentCategory(cat.name)}
              style={{ background: cat.color }}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts }) {
  if (facts.length === 0) {
    return <span>No Fact For This Category Yet! Create First One</span>;
  }

  return (
    <section>
      <ul className="fact-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} />
        ))}
      </ul>
      <p>There are {facts.length} Facts</p>
    </section>
  );
}

function Fact({ fact }) {
  return (
    <li className="fact">
      <p>
        {fact.text}
        <a href={fact.source} className="source" target="_blank">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category)
            .color,
        }}
      >
        {fact.category}
      </span>

      <div class="vote-buttons">
        <button>👍 ${fact.votesInteresting}</button>
        <button>😮 ${fact.votesMindblowing}</button>
        <button>👎 ${fact.votesFalse}</button>
      </div>
    </li>
  );
}

export default App;
