import Indicator from '@/components/Indicator';
import LinkButton from '@/components/LinkButton';
import { t } from '@/helpers/translation';
import { useCalendarFilters } from '@/hooks/useCalendarFilters';
import useColors from '@/hooks/useColors';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import * as Updates from 'expo-updates';
import { Platform, Pressable, View } from 'react-native';
import { SettingsScreen, StatisticsScreen } from '../screens';
import CalendarScreen from '../screens/Calendar';
import { MyTabBar } from "./MyTabBar";
import HomeScreen from '@/screens/Home';
import Therapists from '@/screens/Therapists/Therapists';

const Tab = createBottomTabNavigator();

export const BottomTabs = () => {
  const colors = useColors();
  const calendarFilters = useCalendarFilters();
  const navigation = useNavigation();

  const defaultOptions = {
    headerTintColor: colors.text,
    headerStyle: {
      backgroundColor: colors.background,
      shadowColor: 'transparent',
      borderBottomWidth: 1,
      borderBottomColor: colors.headerBorder,
    },
    headerShadowVisible: Platform.OS !== 'web',
    tabBarStyle: {
      borderTopColor: colors.headerBorder,
    },
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerStyle: {
          borderBottomColor: '#fff',
        },
      })}
      tabBar={props => <MyTabBar {...props} />}
    >
       <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          ...defaultOptions,
          headerShown: false,
          tabBarTestID: 'home',
          title: t('home'),
        })} />   
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={({ navigation }) => ({
          ...defaultOptions,
          headerRight: () => (
            <View style={{ paddingRight: 16 }}>
              <LinkButton
                onPress={() => {
                  if (calendarFilters.isOpen) {
                    calendarFilters.close();
                  } else {
                    calendarFilters.open();
                  }
                }}
                testID="filters"
                type='primary'
                icon="Filter"
              >
                {t('calendar_filters')} {calendarFilters.data.isFiltering ? `(${calendarFilters.data.filterCount})` : ''}
              </LinkButton>
            </View>
          ),
          tabBarTestID: 'calendar',
          title: t('calendar'),
        })} />
              <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={({ navigation }) => ({
          ...defaultOptions,
          headerShown: false,
          tabBarTestID: 'statistics',
          title: t('statistics'),
        })} />
              <Tab.Screen
        name="Therapists"
        component={Therapists}
        options={({ navigation }) => ({
          ...defaultOptions,
          headerShown: false,
          tabBarTestID: 'therapists',
          // title: t('therapists'),
          title: 'therapists',
        })} />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={({ navigation }) => ({
          ...defaultOptions,
          headerShown: false,
          tabBarTestID: 'settings',
          title: t('settings'),
        })} />
    </Tab.Navigator>
  );
};
