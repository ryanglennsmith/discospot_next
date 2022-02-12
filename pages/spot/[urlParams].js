import useURLParams from "../../hooks/useURLParams";
import useSpot from "../../hooks/useSpot";
import Link from "next/link";

const Query = () => {
  const { accessToken, refreshToken } = useURLParams();
  const [spotData] = useSpot(accessToken, {
    endpoint: "top50",
    artistId: null,
    genre: null,
  });

  if (spotData !== undefined) {
    return (
      <div>
        <h1 className="text-6xl mb-3">top 50 artists</h1>
        {/* make these links and go get recommendations based on that seed */}
        {spotData.items.map((artist) => (
          <div className="text-xl" key={artist.id}>
            <Link
              href={`/spot/recommend/access_token=${accessToken}&refresh_token=${refreshToken}&seed=${artist.id}&genre`}
            >
              <a>{artist.name}</a>
            </Link>{" "}
            | {artist.id} |{" "}
            <ul className="text-sm">
              {artist.genres.map((genre, index) => (
                <li key={artist.name + genre + index}>{genre}</li>
              ))}
            </ul>
          </div>
        ))}
        {spotData.items[0].genres.map((genre, index) => {
          <p key={index}>{genre}</p>;
        })}
      </div>
    );
  } else {
    return <p>loading</p>;
  }
};

export default Query;

// import useURLParams from "../../hooks/useURLParams";
// import Link from "next/link";

// const Spot = () => {
//   const { accessToken, refreshToken } = useURLParams();

//   return (
//     <>
//       <h2>
//         login successful, go{" "}
//         <Link
//           href={`/access_token=${accessToken}&refresh_token=${refreshToken}`}
//         >
//           <a>get my top 50</a>
//         </Link>
//         .
//       </h2>
//     </>
//   );
// };

// export default Spot;
