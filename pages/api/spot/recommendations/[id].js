export default async function handler(req, res) {
  const recommendation = await req.query.id;
  const accessToken = await req.cookies.access_token;
  const spotResponse = await fetch(
    `https://api.spotify.com/v1/recommendations?seed_artists=${encodeURIComponent(
      recommendation
    )}&limit=5`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  const spotData = await spotResponse.json();
  const spotPayload = spotData.tracks.map((track) => {
    return {
      id: track.album.id,
      artist: track.album.artists[0].name,
      title: track.album.name,
      image: track.album.images[0].url,
    };
  });

  const fetchDisco = async (data) => {
    const promises = data.map(async (item) => {
      const url = `https://api.discogs.com/database/search?release_title=${encodeURIComponent(
        item.title
      )}&artist=${encodeURIComponent(item.artist)}&type=master`;
      const headers = {
        headers: {
          Authorization: `Discogs token=${process.env.NEXT_PUBLIC_DISCO_ACCESS_TOKEN}`,
          "User-Agent": `"${process.env.NEXT_PUBLIC_DISCO_USER_AGENT}"`,
        },
      };
      const res = await fetch(url, headers);
      const data = await res.json();
      console.log("disco_data: ", data);
      return data;
    });
    const disco = await Promise.all(promises);
    return disco;
  };

  const discoData = await fetchDisco(spotPayload);

  const discoPayload = discoData.map((artist) => {
    if (artist.results[0] === undefined) {
      return {
        master_id: null,
      };
    }
    return {
      master_id: artist.results[0].master_id,
      artist_title: artist.results[0].title,
    };
  });

  res.json({ spotData: spotPayload, discoData: discoPayload });
}
