// App.js
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useColorScheme, StyleSheet, View } from 'react-native';
import Settings from './views/Settings';
import Icon from 'react-native-vector-icons/Ionicons';
import ItemList from './views/ItemList';
import CreateItem from './views/CreateItem';
import EditItem from './views/EditItem';
import DrawerContent from './components/DrawerContent';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const StackNavigator = () => {
    const colorScheme = useColorScheme();

    return (
      <View 
        style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}
      >
        <Stack.Navigator
          initialRouteName="Machines"
          screenOptions={{
              headerStyle: {
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
              },
              headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
              headerTitleStyle: {
                  fontWeight: 'bold',
              },
              cardStyle: {
                backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
            },
            cardOverlayEnabled: false,
          }}
        >
          <Stack.Screen
              name="Machines"
              component={ItemList}
              options={({ navigation }) => ({
                  title: 'Machines',
                  headerLeft: () => (
                      <Icon.Button
                          name="menu"
                          size={25}
                          backgroundColor={colorScheme === 'dark' ? '#333' : '#fff'}
                          color={colorScheme === 'dark' ? '#fff' : '#000'}
                          onPress={() => navigation.openDrawer()}
                      />
                  ),
              })}
          />
          <Stack.Screen
              name="Add Machine"
              component={CreateItem}
              options={{ title: 'Add Machine' }}
          />
          <Stack.Screen
              name="Edit Machine"
              component={EditItem}
              options={{ title: 'Edit Machine' }}
          />
          <Stack.Screen
              name="Settings"
              component={Settings}
              options={{ title: 'Settings' }}
          />
        </Stack.Navigator>
      </View>
    );
};

export default function App() {
    const colorScheme = useColorScheme();

    return (
        <View
        style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}
        >
          <NavigationContainer style={{backgroundColor: "#333"}}>
              <Drawer.Navigator
                  drawerContent={(props) => <DrawerContent {...props} />}
                  screenOptions={{
                      drawerStyle: {
                          backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
                          width: 200,
                      },
                      drawerActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
                      drawerInactiveTintColor: colorScheme === 'dark' ? '#ccc' : '#888',
                      sceneContainerStyle: {
                        backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
                      },
                      drawerType: 'front', // Try 'slide' or 'back' to see if it resolves the flicker
                      // overlayColor: 'transparent', // Remove the overlay color to avoid flicker
                  }}
              >
                  <Drawer.Screen
                      name="Home"
                      component={StackNavigator}
                      options={{ headerShown: false }}
                  />
              </Drawer.Navigator>
          </NavigationContainer>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
});