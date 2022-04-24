import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

//create a multiple endpoint hook
export const useFetchAPIMultiple = (url: string[]) => {
  const [data, setData] = useState([] as AxiosResponse<any>[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await axios
          .all(url.map((endpoint: string) => axios.get(endpoint)))
          .then((res) => {
            const data = res.map((r: AxiosResponse) => r.data);
            setData(data);
          });
      } catch (err) {
        setError(err as null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
};
