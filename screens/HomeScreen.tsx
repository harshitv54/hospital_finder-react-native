import React, { useEffect, useState } from 'react';
import { View, Button, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { COLORS } from '@/misc/themes';
import { StatusBar } from 'expo-status-bar';

const HomeScreen = (props:any) => {
  const [region, setRegion] = useState(null);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    getLocation();
  }, []);

  const fetchNearbyHospitals = async (latitude, longitude) => {

    try {
      const response = await axios.get(
        `https://api.geocode.earth/v1/autocomplete?focus.point.lat=${latitude}&focus.point.lon=${longitude}&api_key=ge-562afb6313c19b57&text=Hospital`,
        
      );
      const nearbyHospitals = response.data.features.filter(
        feature => feature.properties.layer === 'venue' && feature.properties.name.includes('Hospital'),
      );

      setHospitals(nearbyHospitals);
    } catch (error) {
      console.error('Error fetching nearby hospitals:', error);
      console.log('Error: ', error.response);
    }
  };

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421, 
      });

      fetchNearbyHospitals(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error('Error getting current position:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', width: '100%'  }}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} style='light' />
      <View style={{flexDirection: 'row',justifyContent: 'space-between', padding: 10, backgroundColor: COLORS.primaryBlackHex }}>
      <Button title="Show Hospitals" onPress={getLocation} />
      <Button title="Log Out" onPress={props.logout} />
      </View>
      {region && (
      <View style={{flex: 1}}>
        <MapView
          style={{ flex: 1}}
          initialRegion={region}
          region={region}
          showsCompass={true}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
        >
          {hospitals.map((hospital, index) => { 
            return(
              <Marker
              key={index}
              coordinate={{
                latitude: hospital.geometry.coordinates[1],
                longitude: hospital.geometry.coordinates[0],
              }}
              title={hospital.properties.name}
            />
            )
          })}
        </MapView>
        </View>
        )}
    </SafeAreaView>
  );
};

export default HomeScreen;
