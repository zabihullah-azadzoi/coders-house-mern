import { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import { autoRefreshHandler } from "../http/activateRequests";
import { setAuth } from "../store/reducers/authReducer";

const useRefreshOnReload = () => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const randomColorGenerator = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  useEffect(() => {
    setIsLoading(true);
    autoRefreshHandler()
      .then((res) => {
        if (!res.data || !res.data.user) return;

        setIsLoading(false);
        dispatch(
          setAuth({
            user: { ...res.data.user, borderColor: randomColorGenerator() },
          })
        );
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [dispatch]);

  return { isLoading };
};

export default useRefreshOnReload;
