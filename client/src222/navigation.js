import React, { Component } from 'react';

import {
  StackActions,
  NavigationActions,
  createStackNavigator,
  createSwitchNavigator,
  createMaterialTopTabNavigator,
} from 'react-navigation';
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import {
  Text, View, StyleSheet, BackHandler, TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Articles from './screens/articles.screen';
import InfoArticle from './screens/infoArticle.screen';
import Chats from './screens/chats.screen';
import Messages from './screens/messages.screen';
import NewArticle from './screens/newArticle.screen';
import UserArticles from './screens/userArticles.screen';
import Login from './screens/login.screen.js/login';
import Register from './screens/login.screen.js/signUp';
import Profile from './screens/profile.screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  iconoPerf: {
    marginStart: 5,
  },
  iconoChat: {
    marginEnd: 5,
  },
});

// tabs in main screen
const MainScreenNavigator = createMaterialTopTabNavigator({
  Store: { screen: Articles },
  MyStore: { screen: UserArticles },
},
{
  tabBarOptions: {
    activeTintColor: 'red',
    inactiveTintColor: '#aaaaaa',
    labelStyle: {
      fontSize: 10,
    },
    indicatorStyle: {
      borderBottomColor: 'red',
      borderBottomWidth: 1,
    },
    tabStyle: {
      indicatorStyle: 'red',
    },
    style: {
      backgroundColor: '#e3e8ef',
      height: 40,
    },
  },
  initialRouteName: 'Store',
});

/* const MainScreenNavigator = createBottomTabNavigator(
  {
    Buscador: {
      screen: MyStoreNavigate,
      navigationOptions: {
        tabBarLabel: 'Search',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-search" color={tintColor} size={24} />
        ),
      },
    },
    Login: {
      screen: Login,
      navigationOptions: {
        tabBarLabel: 'Login',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-settings" color={tintColor} size={24} />
        ),
      },
    },
    Messeges: {
      screen: Chats,
      navigationOptions: {
        tabBarLabel: 'Messages',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-mail" color={tintColor} size={24} />
        ),
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-contact" color={tintColor} size={24} />
        ),
      },
    }

  }, // fuera de mainscreen
  {
    initialRouteName: 'Buscador',
    order: ['Messeges', 'Buscador', 'Login', 'Profile'],
    navigationOptions: {

    },
    tabBarOptions: {
      activeTintColor: 'red',
      inactiveTintColor: '#02c8ef',
    },
  },
); */

const StackNavigator = createStackNavigator(
  {
    Main: { screen: MainScreenNavigator },
    Messages: {
      screen: Messages,
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#02c8ef',
          height: 50,
        },
        headerTitleStyle: {

        },
        headerTintColor: '#fff',
        title: 'Mensajes',
      },
    },
    InfoArticles: {
      screen: InfoArticle,
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#02c8ef',
          height: 50,
        },
        headerTitleStyle: {

        },
        headerTintColor: '#fff',
        title: 'Producto',
      },
    },
    NewArticle: {
      screen: NewArticle,
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#02c8ef',
          height: 50,
        },
        headerTitleStyle: {

        },
        headerTintColor: '#fff',
        title: 'Vendiendo',
      },
    },
    Login: {
      screen: Login,
      navigationOptions: {
        tabBarLabel: 'Login',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-settings" color={tintColor} size={24} />
        ),
      },
    },
    Register: {
      screen: Register,
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-contact" color={tintColor} size={24} />
        ),
      },
    },
    Messeges: {
      screen: Chats,
      navigationOptions: {
        tabBarLabel: 'Messages',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-mail" color={tintColor} size={24} />
        ),
      },
    },
  },
  {

    navigationOptions: ({ navigation }) => ({
      title: 'Wally',
      headerStyle: {
        height: 40,
        borderRadiusBottom: 10,
        color: 'red',
      },
      headerTintColor: '#02c8ef',
      headerRight:
  <View>
    <TouchableHighlight
      onPress={() => {
        navigation.navigate('Messeges');
      }}
    >
      <Icon
        name="ios-mail"
        color="#02c8ef"
        style={styles.iconoChat}
        size={34}
      />
    </TouchableHighlight>
  </View>,
      headerLeft:
  <View>
    <TouchableHighlight
      onPress={() => {
        navigation.navigate('Profile');
      }}
    >
      <Icon name="ios-contact" style={styles.iconoPerf} color="#02c8ef" size={34} />
    </TouchableHighlight>
  </View>,
    }),
  },
);
const AppNavigator = createSwitchNavigator(
  {
    Auth: Login,
    App: StackNavigator,
  },
  {
    initialRouteName: 'Auth',
  },
);
// reducer initialization code
const initialState = AppNavigator.router.getStateForAction(
  StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: 'Main',
      }),
    ],
  }),
);


export const navigationReducer = (state = null, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};


// Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
export const navigationMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav,
);
const App = reduxifyNavigator(AppNavigator, 'root');
const mapStateToProps = state => ({
  state: state.nav,
});

class AppWithBackPress extends Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.back());
    return true;
  };

  render() {
    return <App {...this.props} />;
  }
}
const AppWithNavigationState = connect(mapStateToProps)(AppWithBackPress);
export default AppWithNavigationState;
