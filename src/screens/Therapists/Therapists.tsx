import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


interface Therapist {
  id: string;
  name: string;
  specializations: string[];
  description: string;
  image: string;
  experience: string;
  education: string;
}

type RootStackParamList = {
    Therapists: undefined;
    TherapistDetail: { id: string };
  };
  
  type TherapistsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Therapists'>;

const therapists: Therapist[] = [
  {
    id: '1',
    name: 'Dr. Jane Smith',
    specializations: ['Depression', 'Anxiety'],
    description: 'Experienced therapist specializing in mood disorders.',
    image: 'https://via.placeholder.com/150',
    experience: '10 years',
    education: 'Ph.D. in Clinical Psychology, Stanford University',
  },
  {
    id: '2',
    name: 'Dr. John Doe',
    specializations: ['PTSD', 'Trauma'],
    description: 'Expert in trauma-focused cognitive behavioral therapy.',
    image: 'https://via.placeholder.com/150',
    experience: '15 years',
    education: 'Psy.D. in Clinical Psychology, Harvard University',
  },
  // Add more therapists as needed
];

interface TherapistCardProps {
  item: Therapist;
  onPress: () => void;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={{ uri: item.image }} style={styles.image} />
    <View style={styles.cardContent}>
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.specializationContainer}>
        {item.specializations.map((spec, index) => (
          <TouchableOpacity key={index} style={styles.specializationButton}>
            <Text style={styles.specializationText}>{spec}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  </TouchableOpacity>
);

const Therapists: React.FC = () => {
    const navigation = useNavigation<TherapistsScreenNavigationProp>();
  
    const handleTherapistPress = (therapist: Therapist) => {
      navigation.navigate('TherapistDetail', { id: therapist.id });
    };

  return (
    <View style={styles.container}>
      <FlatList
        data={therapists}
        renderItem={({ item }: { item: Therapist }) => (
          <TherapistCard item={item} onPress={() => handleTherapistPress(item)} />
        )}
        keyExtractor={(item: Therapist) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  cardContent: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  specializationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  specializationButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginRight: 5,
    marginBottom: 5,
  },
  specializationText: {
    fontSize: 12,
  },
  description: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default Therapists;