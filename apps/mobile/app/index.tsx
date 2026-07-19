import { Redirect } from "expo-router";
import { ActivityIndicator } from "react-native";
import { Screen } from "../components/Screen";
import { useSessionRedirect } from "../hooks/useSessionRedirect";
import { colors } from "../theme/tokens";

export default function Index() {
  const target = useSessionRedirect();

  if (!target) {
    return (
      <Screen>
        <ActivityIndicator color={colors.electric} size="large" />
      </Screen>
    );
  }

  return <Redirect href={target} />;
}
