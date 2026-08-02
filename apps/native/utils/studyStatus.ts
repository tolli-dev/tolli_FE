import AsyncStorage from "@react-native-async-storage/async-storage";

export async function isStudyCompletedToday(): Promise<boolean> {
  const completedDate = await AsyncStorage.getItem("studyCompletedDate");
  return completedDate === new Date().toDateString();
}
