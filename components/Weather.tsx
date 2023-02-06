import React from "react";
import { ActivityIndicator, StyleSheet, Image } from "react-native";
import { useWeather } from "../hooks/useWeather";

import { Text, View } from "./Themed";

const getIconLink = (icon: string): string => {
  return "http://openweathermap.org/img/wn/" + icon + ".png";
};

export default function Weather() {
  const { data, error, isFetching } = useWeather();

  return (
    <View style={styles.main}>
      {error && (
        <Text style={styles.error}>Sorry! Something went wrong...</Text>
      )}
      {!error && !data && isFetching && (
        <ActivityIndicator size="large" color="#fff" />
      )}
      {!error && !isFetching && data && (
        <View style={styles.info}>
          <Text style={styles.cityName}>{data.name}</Text>
          <Image
            style={styles.weatherIcon}
            source={{ uri: getIconLink(data.weather[0].icon) }}
          />
          <Text>t: {Math.round(data.main.temp - 273.15)}ºC</Text>
          <Text>Feels like: {Math.round(data.main.feels_like - 273.15)}ºC</Text>
          <Text>Pressure: {data.main.pressure}hPa</Text>
          <Text>Humidity: {data.main.humidity}%</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    minHeight: "90%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 10,
  },
  error: {
    color: "#c60000",
  },
  info: {
    flex: 1,
  },
  cityName: {
    textDecorationLine: "underline",
    marginBottom: 5,
  },
  weatherIcon: {
    width: 80,
    height: 80,
  },
});
