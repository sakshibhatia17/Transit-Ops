import { useState } from "react";

function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return {
    data,
    setData,
    loading,
    setLoading,
    error,
    setError,
  };
}

export default useApi;