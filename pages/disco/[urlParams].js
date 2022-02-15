import React from "react";
import useURLParams from "../../hooks/useURLParams";
import { useEffect, useState } from "react";

const DiscoSellers = () => {
  const { artist, title } = useURLParams();
  const [masterId, setMasterId] = useState();
  const [sellers, setSellers] = useState();
  useEffect(() => {
    const fetchMasterId = async () => {
      const res = await fetch(`/api/disco/master_ids/a=${artist}&t=${title}`);
      const data = await res.json();
      setMasterId(data.master_id);
    };
    fetchMasterId();
  }, [artist, title]);
  useEffect(() => {
    const fetchSellers = async () => {
      const res = await fetch(`/api/disco/sellers/${masterId}`);
      const data = await res.json();
      console.log("sellers list: ", data);
      setSellers(data);
    };
    fetchSellers();
  }, [masterId]);
  if (sellers !== undefined) {
    return (
      <div>
        <ul>
          {sellers.sellers.map((seller) => (
            <li key={seller}>{seller}</li>
          ))}
        </ul>
      </div>
    );
  }
  return <div>DiscoSellers master id: {masterId}</div>;
};

export default DiscoSellers;
