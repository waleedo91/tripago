import { useState, useEffect, useRef } from "react";

export const useFetch = (url, _options) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const options = useRef(_options).current;

  useEffect(() => {
    console.log(options);
    const controller = new AbortController();

    const fetchData = async () => {
      setIsPending(true);
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const json = await response.json();

        setIsPending(false);
        setData(json);
        setError(null);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("The fetch was aborted");
        } else {
          setIsPending(false);
          setError("Could not fetch data");
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url, options]);

  return { data, isPending, error };
};
