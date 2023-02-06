import { useEffect, useState } from "react";

interface Weather {
  isFetching: boolean;
  error: boolean;
  data: Data;
}

export type Data = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
} | null;

const API_Key = "";

export const useWeather: () => Weather = () => {
  const [data, setData] = useState<Data>(null);
  const [error, setError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setIsFetching(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_Key}`
        )
          .then((response) => {
            response.json().then((result) => {
              if (result?.cod === 200) {
                setData(result);
                setIsFetching(false);
                setError(false);
              } else {
                setIsFetching(false);
                setError(true);
              }
            });
          })
          .catch((e) => {
            setData(null);
            setError(true);
          });
      },
      () => {
        setError(true);
        setIsFetching(false);
      }
    );
  }, []);

  return { data, error, isFetching };
};
