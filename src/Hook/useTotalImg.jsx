import axios from "axios";
import { useQuery } from "@tanstack/react-query";
const useTotalImg = () => {
  const { refetch, data: totalImg = [] } = useQuery({
    ueryKey: ["totalImg"],
    queryFn: async () => {
      const res = await axios.get(
        "https://photo-gallery-three-gamma.vercel.app/getPhotos"
      );
      return res.data;
    },
  });

  return [totalImg, refetch];
};

export default useTotalImg;
