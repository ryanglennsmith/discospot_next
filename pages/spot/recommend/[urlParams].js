import useURLParams from "../../../hooks/useURLParams";
import useSpot from "../../../hooks/useSpot";
import Link from "next/link";

const Recommend = () => {
  const { accessToken, refreshToken, seed } = useURLParams();
  const [spotData] = useSpot(accessToken);
  return <div>go listen to: {seed}</div>;
};
export default Recommend;
