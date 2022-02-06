import React, { useEffect, useState } from "react";

const Crawl = () => {
  const [html, setHtml] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const masterID = "1267830";
      const res = await fetch(
        `https://www.discogs.com/sell/list?master_id=${masterID}&ev=mb&currency=GBP&format=Vinyl`,
        {
          mode: "no-cors",
        }
      );
      console.log(res.text());
      const data = await res.text();
      setHtml(data);
    };
    fetchData();
  }, [html]);
  return (
    <div>
      <pre>{html}</pre>
    </div>
  );
};

export default Crawl;
