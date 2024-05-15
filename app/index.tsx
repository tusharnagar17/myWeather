import { View, Text, SafeAreaView, Image, TextInput } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import "nativewind";
import { Constants } from "expo-constants";
import { Theme } from "@/constants/Theme";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const HomePage = () => {
  const [showSearch, setToggleSearch] = useState(false);

  const locations = ["1", "2", "3"];

  const handleLocation = (loc: string) => {
    console.log(loc);
  };

  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image
        source={require("./../assets/background/2.jpg")}
        className="h-full w-full absolute"
        blurRadius={80}
      />
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
          {locations.length > 0 && showSearch ? (
            <View className="absolute w-full top-16 bg-gray-300 rounded-3xl">
              {locations.map((loc: string, index: number) => {
                let showBorder = index + 1 != locations.length;
                let borderClass = showBorder
                  ? "border-b-2 border-gray-400"
                  : "";
                return (
                  <TouchableOpacity
                    className={`flex-row items-center border-0 p-3 px-4 mb-1 ${borderClass}`}
                    key={index}
                    onPress={() => handleLocation(loc)}
                  >
                    <Feather name="map-pin" size={20} color={"gray"} />
                    <Text className="text-black text-lg ml-2">
                      London, United States {loc}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomePage;
