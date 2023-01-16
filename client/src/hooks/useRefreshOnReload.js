import { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import { autoRefreshHandler } from "../http/activateRequests";
import { setAuth } from "../store/reducers/authReducer";

const useRefreshOnReload = () => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    autoRefreshHandler()
      .then((res) => {
        if (!res.data || !res.data.user) return;

        setIsLoading(false);
        dispatch(setAuth(res.data));
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [dispatch]);

  return { isLoading };
};

export default useRefreshOnReload;
