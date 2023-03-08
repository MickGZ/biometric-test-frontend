import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons as IconHome } from "@expo/vector-icons";
import { MaterialCommunityIcons as LoginIcon } from "@expo/vector-icons";
import HomeNavigation from "../navigation/HomeNavigation";
import Login from "../screens/Login";

const Tab = createBottomTabNavigator();

function Navigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeMenu"
        component={HomeNavigation}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <IconHome name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Login"
        component={Login}
        options={{
          tabBarIcon: ({ color, size }) => (
            <LoginIcon name="login" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default Navigation;
