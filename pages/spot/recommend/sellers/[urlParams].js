import React from "react";
import useURLParams from "../../../../hooks/useURLParams";
const Sellers = () => {
  const { artist, title } = useURLParams();

  if (artist) {
    return (
      <div>
        {artist} | {title}
      </div>
    );
  }
  return <div>loading</div>;
};
export default Sellers;
