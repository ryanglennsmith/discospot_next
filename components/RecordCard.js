import React from "react";
import Link from "next/link";
import Image from "next/image";

const RecordCard = ({ disco }) => {
  const { price, source, url, shippingPrice, comments, thumb } = disco;
  return (
    <Link href={url} passHref>
      <a target="_blank">
        <div className="">
          <Image src={thumb} alt={url} width="150px" height="150px" />
          <ul>
            <li>price: {price}</li>
            <li>shipping from: {source}</li>
            <li>shipping cost: {shippingPrice}</li>
            <li>{comments}</li>
          </ul>
        </div>
      </a>
    </Link>
  );
};

export default RecordCard;
