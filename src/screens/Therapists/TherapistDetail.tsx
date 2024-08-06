import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';

interface Therapist {
  id: string;
  name: string;
  specializations: string[];
  description: string;
  image: string;
  experience: string;
  education: string;
}

type RouteParams = {
  id: string;
};

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

const TherapistDetail: React.FC = () => {
  const route = useRoute();
  const { id } = route.params as RouteParams;
  const therapist = therapists.find(t => t.id === id);

  if (!therapist) {
    return <Text>Therapist not found</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: therapist.image }} style={styles.image} />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{therapist.name}</Text>
        <Text style={styles.sectionTitle}>Specialization</Text>
        <View style={styles.specializationContainer}>
          {therapist.specializations.map((spec, index) => (
            <TouchableOpacity key={index} style={styles.specializationButton}>
              <Text style={styles.specializationText}>{spec}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Work Experience</Text>
        <Text style={styles.text}>{therapist.experience}</Text>
        <Text style={styles.sectionTitle}>Education Background</Text>
        <Text style={styles.text}>{therapist.education}</Text>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.text}>{therapist.description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  specializationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specializationButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  specializationText: {
    fontSize: 14,
  },
});

export default TherapistDetail;