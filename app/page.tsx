'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Heart,
  MapPin,
  Hospital,
  Users,
  Dog,
  Cat,
  Search,
  Phone,
  Mail,
  Calendar,
  Star,
  Award,
  Shield,
  Navigation
} from 'lucide-react';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import Preloader from '@/components/Preloader';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/hooks/useAuth';

interface Animal {
  id: number;
  name: string;
  type: 'dog' | 'cat' | 'other';
  age: string;
  breed: string;
  description: string;
  image: string;
  location: string;
  vaccinated: boolean;
  neutered: boolean;
  trained: boolean;
}

interface RescuePoint {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  services: string[];
}

interface Hospital {
  id: number;
  name: string;
  address: string;
  phone: string;
  emergency: boolean;
  rating: number;
  specialties: string[];
}

const animals: Animal[] = [
  {
    id: 1,
    name: "Buddy",
    type: "dog",
    age: "2 years",
    breed: "Golden Retriever",
    description: "Friendly and energetic dog who loves playing fetch and spending time with families.",
    image: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400",
    location: "Downtown Shelter",
    vaccinated: true,
    neutered: true,
    trained: true
  },
  {
    id: 2,
    name: "Luna",
    type: "cat",
    age: "1 year",
    breed: "Persian",
    description: "Gentle and affectionate cat who enjoys quiet environments and gentle petting.",
    image: "https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&cs=tinysrgb&w=400",
    location: "North Side Rescue",
    vaccinated: true,
    neutered: false,
    trained: false
  },
  {
    id: 3,
    name: "Max",
    type: "dog",
    age: "3 years",
    breed: "Labrador Mix",
    description: "Loyal companion who is great with children and other pets.",
    image: "https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=400",
    location: "West End Shelter",
    vaccinated: true,
    neutered: true,
    trained: true
  },
  {
    id: 4,
    name: "Whiskers",
    type: "cat",
    age: "4 years",
    breed: "Tabby",
    description: "Independent yet loving cat who enjoys sunny windows and cozy spots.",
    image: "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400",
    location: "Downtown Shelter",
    vaccinated: true,
    neutered: true,
    trained: false
  },
  {
    id: 5,
    name: "Rocky",
    type: "dog",
    age: "5 years",
    breed: "German Shepherd",
    description: "Protective and intelligent dog perfect for active families.",
    image: "https://images.pexels.com/photos/1938126/pexels-photo-1938126.jpeg?auto=compress&cs=tinysrgb&w=400",
    location: "East Side Rescue",
    vaccinated: true,
    neutered: true,
    trained: true
  },
  {
    id: 6,
    name: "Bella",
    type: "cat",
    age: "2 years",
    breed: "Siamese",
    description: "Playful and vocal cat who loves interactive toys and attention.",
    image: "https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg?auto=compress&cs=tinysrgb&w=400",
    location: "North Side Rescue",
    vaccinated: true,
    neutered: true,
    trained: false
  }
];

const rescuePoints: RescuePoint[] = [
  {
    id: 1,
    name: "Downtown Animal Shelter",
    address: "123 Main Street, Downtown",
    phone: "(555) 123-4567",
    email: "info@downtownrescue.org",
    hours: "Mon-Fri: 9AM-6PM, Sat-Sun: 10AM-4PM",
    services: ["Adoption", "Veterinary Care", "Grooming", "Training"]
  },
  {
    id: 2,
    name: "North Side Pet Rescue",
    address: "456 Oak Avenue, North Side",
    phone: "(555) 234-5678",
    email: "contact@northsiderescue.org",
    hours: "Daily: 8AM-7PM",
    services: ["Adoption", "Foster Care", "Rehabilitation", "Emergency Care"]
  },
  {
    id: 3,
    name: "West End Animal Haven",
    address: "789 Pine Road, West End",
    phone: "(555) 345-6789",
    email: "help@westendrescue.org",
    hours: "Mon-Sat: 7AM-8PM, Sun: 9AM-5PM",
    services: ["Adoption", "Boarding", "Training", "Pet Supplies"]
  }
];

const hospitals: Hospital[] = [
  {
    id: 1,
    name: "Central Veterinary Hospital",
    address: "321 Health Boulevard, Central District",
    phone: "(555) 999-1111",
    emergency: true,
    rating: 4.8,
    specialties: ["Emergency Care", "Surgery", "Cardiology", "Oncology"]
  },
  {
    id: 2,
    name: "Eastside Animal Clinic",
    address: "654 Wellness Street, East Side",
    phone: "(555) 888-2222",
    emergency: false,
    rating: 4.6,
    specialties: ["General Care", "Dentistry", "Dermatology", "Nutrition"]
  },
  {
    id: 3,
    name: "24/7 Emergency Pet Care",
    address: "987 Emergency Lane, Medical District",
    phone: "(555) 777-3333",
    emergency: true,
    rating: 4.9,
    specialties: ["Emergency Care", "Critical Care", "Trauma", "Poison Control"]
  }
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [activeTab, setActiveTab] = useState('adopt');
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Preloader />;
  }

  const filteredAnimals = animals.filter(animal =>
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-orange-50 relative overflow-hidden">
      <BackgroundAnimation />
      
      {/* Navigation */}
      <nav className="relative z-10 bg-white/90 backdrop-blur-sm shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-800">PawRescue</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button
                onClick={() => setActiveTab('adopt')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'adopt' ? 'text-green-600 bg-green-50' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Adopt
              </button>
              <button
                onClick={() => setActiveTab('locations')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'locations' ? 'text-green-600 bg-green-50' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Locations
              </button>
              <button
                onClick={() => setActiveTab('volunteer')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'volunteer' ? 'text-green-600 bg-green-50' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Volunteer
              </button>
            </div>
            <UserMenu />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 animate-fade-in">
            Save a Life,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Find a Friend
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 animate-fade-in-delay">
            Connect loving animals with caring families. Every adoption creates two happy endings.
          </p>
          {isAuthenticated && (
            <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-green-200 animate-fade-in-delay">
              <p className="text-green-800">
                Welcome back, <span className="font-semibold">{user?.name}</span>! Ready to find your perfect companion?
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg transition-all transform hover:scale-105"
              onClick={() => setActiveTab('adopt')}
            >
              <Heart className="mr-2 h-5 w-5" />
              Adopt Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg transition-all transform hover:scale-105"
              onClick={() => setActiveTab('volunteer')}
            >
              <Users className="mr-2 h-5 w-5" />
              Volunteer
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="adopt" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
              <Heart className="mr-2 h-4 w-4" />
              Adopt Animals
            </TabsTrigger>
            <TabsTrigger value="locations" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <MapPin className="mr-2 h-4 w-4" />
              Find Locations
            </TabsTrigger>
            <TabsTrigger value="volunteer" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Users className="mr-2 h-4 w-4" />
              Volunteer
            </TabsTrigger>
          </TabsList>

          {/* Adoption Tab */}
          <TabsContent value="adopt" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-800">Available Animals</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search animals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-80"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnimals.map((animal) => (
                <Card key={animal.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm">
                  <div className="relative">
                    <img
                      src={animal.image}
                      alt={animal.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {animal.type === 'dog' ? (
                        <Dog className="h-6 w-6 text-white bg-black/50 rounded-full p-1" />
                      ) : (
                        <Cat className="h-6 w-6 text-white bg-black/50 rounded-full p-1" />
                      )}
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{animal.name}</CardTitle>
                        <CardDescription>{animal.breed} • {animal.age}</CardDescription>
                      </div>
                      <Heart className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">{animal.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {animal.vaccinated && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <Shield className="mr-1 h-3 w-3" />
                          Vaccinated
                        </Badge>
                      )}
                      {animal.neutered && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          <Award className="mr-1 h-3 w-3" />
                          Neutered
                        </Badge>
                      )}
                      {animal.trained && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          <Star className="mr-1 h-3 w-3" />
                          Trained
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {animal.location}
                      </span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Learn More
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{animal.name}</DialogTitle>
                            <DialogDescription>
                              {animal.breed} • {animal.age}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <img
                              src={animal.image}
                              alt={animal.name}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <p className="text-gray-600">{animal.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {animal.vaccinated && (
                                <Badge className="bg-green-100 text-green-700">Vaccinated</Badge>
                              )}
                              {animal.neutered && (
                                <Badge className="bg-blue-100 text-blue-700">Neutered</Badge>
                              )}
                              {animal.trained && (
                                <Badge className="bg-orange-100 text-orange-700">Trained</Badge>
                              )}
                            </div>
                            <Button 
                              className="w-full bg-green-600 hover:bg-green-700"
                              disabled={!isAuthenticated}
                            >
                              <Heart className="mr-2 h-4 w-4" />
                              {isAuthenticated ? `Adopt ${animal.name}` : 'Sign in to Adopt'}
                            </Button>
                            {!isAuthenticated && (
                              <p className="text-sm text-gray-500 text-center">
                                Please sign in to start the adoption process
                              </p>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Rescue Points */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <MapPin className="mr-2 h-6 w-6 text-green-600" />
                  Rescue Points
                </h3>
                <div className="space-y-4">
                  {rescuePoints.map((point) => (
                    <Card key={point.id} className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{point.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin className="mr-1 h-4 w-4" />
                          {point.address}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="mr-2 h-4 w-4" />
                            {point.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="mr-2 h-4 w-4" />
                            {point.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="mr-2 h-4 w-4" />
                            {point.hours}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {point.services.map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                        <Button size="sm" className="w-full">
                          <Navigation className="mr-2 h-4 w-4" />
                          Get Directions
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Hospitals */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Hospital className="mr-2 h-6 w-6 text-blue-600" />
                  Veterinary Hospitals
                </h3>
                <div className="space-y-4">
                  {hospitals.map((hospital) => (
                    <Card key={hospital.id} className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg flex items-center">
                              {hospital.name}
                              {hospital.emergency && (
                                <Badge className="ml-2 bg-red-100 text-red-700 text-xs">
                                  24/7 Emergency
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <MapPin className="mr-1 h-4 w-4" />
                              {hospital.address}
                            </CardDescription>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">{hospital.rating}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="mr-2 h-4 w-4" />
                            {hospital.phone}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hospital.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          className={`w-full ${
                            hospital.emergency
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Call Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Volunteer Tab */}
          <TabsContent value="volunteer" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Join Our Volunteer Family</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Make a difference in the lives of animals and find purpose in helping those who need it most.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Animal Care Volunteer</CardTitle>
                  <CardDescription>
                    Help with daily care, feeding, and socialization of rescue animals.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    <li>• Feed and water animals</li>
                    <li>• Clean kennels and play areas</li>
                    <li>• Provide companionship and exercise</li>
                    <li>• Assist with basic grooming</li>
                  </ul>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={!isAuthenticated}
                  >
                    {isAuthenticated ? 'Apply Now' : 'Sign in to Apply'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Event Coordinator</CardTitle>
                  <CardDescription>
                    Help organize adoption events and fundraising activities.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    <li>• Plan adoption events</li>
                    <li>• Coordinate with venues</li>
                    <li>• Manage volunteer schedules</li>
                    <li>• Promote events on social media</li>
                  </ul>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!isAuthenticated}
                  >
                    {isAuthenticated ? 'Apply Now' : 'Sign in to Apply'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                    <Navigation className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Transport Volunteer</CardTitle>
                  <CardDescription>
                    Help transport animals to vet appointments and new homes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    <li>• Transport animals safely</li>
                    <li>• Assist with medical appointments</li>
                    <li>• Support adoption meet-ups</li>
                    <li>• Emergency rescue transport</li>
                  </ul>
                  <Button 
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={!isAuthenticated}
                  >
                    {isAuthenticated ? 'Apply Now' : 'Sign in to Apply'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Volunteer Bus Schedule */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Volunteer Bus Schedule</CardTitle>
                <CardDescription>
                  Free transportation to volunteer locations for dedicated volunteers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                    <h4 className="font-semibold text-green-800">Downtown Route</h4>
                    <p className="text-sm text-green-600 mb-2">Every Saturday</p>
                    <div className="space-y-1 text-xs text-green-700">
                      <div>• 8:00 AM - City Hall</div>
                      <div>• 8:15 AM - Central Library</div>
                      <div>• 8:30 AM - Downtown Shelter</div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                    <h4 className="font-semibold text-blue-800">North Side Route</h4>
                    <p className="text-sm text-blue-600 mb-2">Every Sunday</p>
                    <div className="space-y-1 text-xs text-blue-700">
                      <div>• 9:00 AM - North Mall</div>
                      <div>• 9:15 AM - Community Center</div>
                      <div>• 9:30 AM - North Side Rescue</div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                    <h4 className="font-semibold text-orange-800">West End Route</h4>
                    <p className="text-sm text-orange-600 mb-2">Every Saturday</p>
                    <div className="space-y-1 text-xs text-orange-700">
                      <div>• 10:00 AM - West Station</div>
                      <div>• 10:15 AM - Park & Ride</div>
                      <div>• 10:30 AM - West End Haven</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Heart className="h-6 w-6 text-green-500" />
              <span className="text-xl font-bold">PawRescue</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-300">Making a difference, one paw at a time.</p>
              <p className="text-sm text-gray-400 mt-1">© 2025 PawRescue. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}