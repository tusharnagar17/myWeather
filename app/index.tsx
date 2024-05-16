import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useCallback, useState } from "react";
import { StatusBar } from "expo-status-bar";
import "nativewind";
import { Constants } from "expo-constants";
import { Theme } from "@/constants/Theme";
import { EvilIcons, Feather, FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { debounce } from "lodash";
import { fetchLocationForcast, fetchWeatherForcast } from "@/api/weather";
import { LocationProps } from "@/types";
import { weatherImages } from "@/constants";
import * as Progress from "react-native-progress";
import { getData, storeData } from "@/utils/async";

const HomePage = () => {
  const [showSearch, setToggleSearch] = useState(false);
  const [weather, setWeather] = useState({});
  const [searchLocation, setSearchLocation] = useState<LocationProps[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    firstForcast();
  }, []);

  const firstForcast = async () => {
    try {
      let myCity = await getData("city");
      let cityName = myCity ?? "New Delhi"; // Use nullish coalescing operator to handle null and undefined

      setLoading(true); // Start loading

      const data = await fetchWeatherForcast({ city: cityName, days: "7" });
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather forecast:", error);
    } finally {
      setLoading(false); // Ensure loading is stopped in all cases
    }
  };

  const handleLocation = (loc: string) => {
    setSearchLocation([]);
    setToggleSearch(false);
    setLoading(true);
    fetchWeatherForcast({ city: loc, days: "7" }).then((data) => {
      setWeather(data);
    });
    storeData("city", loc);
    setLoading(false);
  };

  const handleSearch = (value: string) => {
    fetchLocationForcast(value).then((data: LocationProps[]) => {
      setSearchLocation(data);
    });
    // console.log(`value : ${value}`);
  };
  // console.log("Weather", weather);
  const { current, location } = weather;

  const handleDebounceText = useCallback(debounce(handleSearch, 1200), []);
  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image
        source={require("./../assets/images/bg.png")}
        className="h-full w-full absolute"
        blurRadius={30}
      />
      {loading ? (
        <View className="flex flex-1 justify-center items-center">
          <Progress.CircleSnail
            color={["red", "green", "blue"]}
            size={140}
            thickness={10}
          />
        </View>
      ) : (
        <SafeAreaView className="flex flex-1 mt-12">
          {/* Show Search */}
          <View style={{ height: "7%" }} className="mx-4 relative z-50">
            <View
              className="flex-row justify-end items-center rounded-full"
              style={{
                backgroundColor: showSearch ? Theme.bg(0.2) : "transparent",
              }}
            >
              {showSearch ? (
                <TextInput
                  onChangeText={handleDebounceText}
                  placeholder="Search City"
                  placeholderTextColor={"white"}
                  className="pl-6 h-10 flex-1 my-2 font-bold"
                />
              ) : null}

              <TouchableOpacity
                onPress={() => setToggleSearch(!showSearch)}
                className=" p-2 rounded-full m-1 text-white"
                style={{ backgroundColor: Theme.bg(0.3) }}
              >
                <Feather
                  name="search"
                  className="font-bold"
                  size={30}
                  color={"white"}
                />
              </TouchableOpacity>
            </View>
            {searchLocation.length > 0 && showSearch ? (
              <View className="absolute w-full top-16 bg-gray-300 rounded-3xl">
                {searchLocation.map((loc: LocationProps, index: number) => {
                  let showBorder = index + 1 != searchLocation.length;
                  let borderClass = showBorder
                    ? "border-b-2 border-gray-400"
                    : "";
                  return (
                    <View key={index}>
                      <TouchableOpacity
                        className={`flex-row items-center border-0 p-3 px-4 mb-1 ${borderClass}`}
                        key={index}
                        onPress={() => handleLocation(loc?.name)}
                      >
                        <Feather name="map-pin" size={20} color={"gray"} />
                        <Text className="text-black text-lg ml-2">
                          {loc?.name} {","} {loc?.country}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ) : null}
          </View>

          {/* Forcast Section */}
          <View className="mx-4 flex justify-around flex-1 mb-2 rounded-xl">
            {/* Location */}
            <View>
              <Text className="text-center text-white text-3xl font-bold">
                {location?.name},
                <Text className="text-2xl text-gray-300 font-semibold">
                  {location?.country}
                </Text>
              </Text>
            </View>
            {/* Weather Icon */}
            <View className="flex  items-center">
              <Image
                source={weatherImages[current?.condition?.text]}
                className="h-52 w-52"
              />
            </View>
            {/* Degree celsius */}
            <View className="space-y-2">
              <Text className="text-center font-bold text-white text-6xl ml-5">
                {current?.temp_c}&#176;
              </Text>
              <Text className="text-center font-bold text-white text-xl tracking-widest">
                {current?.condition?.text}
              </Text>
            </View>
            {/* Other stats */}
            <View className="flex-row justify-around ">
              <View className="flex items-center ">
                <Image
                  source={require("./../assets/icons/wind.png")}
                  className="h-6 w-6"
                />
                <Text className="text-base font-semibold text-white my-2">
                  {current?.wind_kph}KM
                </Text>
              </View>
              <View className="flex items-center ">
                <Image
                  source={require("./../assets/icons/drop.png")}
                  className="h-6 w-6"
                />
                <Text className="text-base font-semibold text-white my-2">
                  23%
                </Text>
              </View>
              <View className="flex items-center ">
                <Image
                  source={require("./../assets/icons/sun.png")}
                  className="h-6 w-6"
                />
                <Text className="text-base font-semibold text-white my-2">
                  6:05 AM
                </Text>
              </View>
            </View>
          </View>
          {/* Forcast for next days */}
          <View className="mb-2 space-y-3">
            <View className="mx-5 flex-row items-center space-x-2">
              <FontAwesome name="calendar" size={22} color={"white"} />
              <Text className="font-bold text-white text-base">
                Daily Forecast
              </Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{ paddingHorizontal: 15 }}
              showsHorizontalScrollIndicator={false}
            >
              {weather?.forecast?.forecastday?.map(
                (item: unknown, index: number) => {
                  // console.log("item", item);
                  let curDate = new Date(item?.date);
                  let options = { weekday: "long" };
                  let dayName = curDate.toLocaleString("en-US", options);

                  return (
                    <View
                      key={index}
                      style={{ backgroundColor: Theme.bg(0.15) }}
                      className="flex justify-center items-center mx-1 w-24 rounded-3xl py-3 "
                    >
                      <Image
                        source={weatherImages[item?.day?.condition?.text]}
                        className="h-11 w-11"
                      />
                      <Text className="text-white font-bold my-1">
                        {dayName}
                      </Text>
                      <Text className="text-white text-xl font-semibold">
                        {item?.day?.avgtemp_c}
                      </Text>
                    </View>
                  );
                }
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
};

export default HomePage;
