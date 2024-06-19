import axios from "axios";
import { ONE_SECOND, ONE_MINUTE } from "src/constants";

const FIVE_SECOND = ONE_SECOND * 5;

const checkOnline = (): void => {
  const request = axios.create({ timeout: ONE_SECOND });
  let timer = FIVE_SECOND;
  let timeoutId: NodeJS.Timeout | null = null;

  const callTimeout = (): void => {
    timeoutId = setTimeout(() => {
      request
        .get(`favicon.ico?dummy=${Math.random()}`)
        .then(
          () => true,
          (err) => Boolean(err.code || err.request.status)
        )
        .then((status) => {
          self.postMessage(status);
          if (status) {
            timer = FIVE_SECOND;
          } else {
            timer = timer < ONE_MINUTE * 5 ? timer * 2 : ONE_MINUTE * 5;
          }
          return status;
        })
        .catch((err: any) => {
          throw new Error(err.message as string);
        });

      callTimeout();
    }, timer);
  };

  self.onmessage = (e) => {
    if (e.data === "terminate") {
      clearTimeout(timeoutId as NodeJS.Timeout);
    }
  };

  callTimeout();
};

checkOnline();
