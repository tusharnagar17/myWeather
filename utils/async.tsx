import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log("unable to save with AsyncStorage", error);
  }
};

export const getData = async (key: string) => {
  try {
    const result = await AsyncStorage.getItem(key);
    return result;
  } catch (error) {
    console.log("Unable to get AsyncStorage data: ", error);
  }
};
