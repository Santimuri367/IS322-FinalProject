import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  ActivityIndicator,
  Platform,
  TouchableOpacity
} from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import bodyTransformationService from '../../services/bodyTransformationService';

/**
 * EnhancedBodyTransformationVisual - Advanced component for body transformation visualization
 * with AI-generated images and personal photo upload capabilities
 * 
 * @param {Object} props
 * @param {Object} props.metricsData - User metrics data
 * @param {boolean} props.loading - Whether the transformation is loading
 * @param {Function} props.onPersonalTransformation - Callback when personal transformation is generated
 */
function EnhancedBodyTransformationVisual({ metricsData, loading = false, onPersonalTransformation }) {
  const theme = useTheme();
  const [transformation, setTransformation] = useState(null);
  const [error, setError] = useState(null);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [personalMode, setPersonalMode] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const [personalTransformation, setPersonalTransformation] = useState(null);
  
  // Body type images for transformation visualization (fallback)
  const bodyTypeImages = {
    male: {
      slim: require('../../assets/body_samples/male_slim.png'),
      athletic: require('../../assets/body_samples/male_athletic.png'),
      muscular: require('../../assets/body_samples/male_muscular.png'),
      bulky: require('../../assets/body_samples/male_bulky.png')
    },
    female: {
      slim: require('../../assets/body_samples/female_slim.png'),
      athletic: require('../../assets/body_samples/female_athletic.png'),
      toned: require('../../assets/body_samples/female_toned.png'),
      muscular: require('../../assets/body_samples/female_muscular.png')
    }
  };
  
  // Fallback URLs if local assets aren't available
  const fallbackImageUrls = {
    male: {
      slim: 'https://via.placeholder.com/300x450/4F46E5/FFFFFF?text=Male+Slim',
      athletic: 'https://via.placeholder.com/300x450/3B82F6/FFFFFF?text=Male+Athletic',
      muscular: 'https://via.placeholder.com/300x450/2563EB/FFFFFF?text=Male+Muscular',
      bulky: 'https://via.placeholder.com/300x450/1D4ED8/FFFFFF?text=Male+Bulky'
    },
    female: {
      slim: 'https://via.placeholder.com/300x450/10B981/FFFFFF?text=Female+Slim',
      athletic: 'https://via.placeholder.com/300x450/059669/FFFFFF?text=Female+Athletic',
      toned: 'https://via.placeholder.com/300x450/047857/FFFFFF?text=Female+Toned',
      muscular: 'https://via.placeholder.com/300x450/065F46/FFFFFF?text=Female+Muscular'
    }
  };

  // Generate transformation based on metrics data
  useEffect(() => {
    if (!metricsData || loading) {
      return;
    }

    generateTransformation();
  }, [metricsData, loading]);
  
  // Generate basic transformation using local assets or fallbacks
  const generateTransformation = () => {
    try {
      // Determine weight change direction and amount
      const weightChange = metricsData.targetWeight - metricsData.currentWeight;
      const isWeightLoss = weightChange < 0;

      // Determine current body type based on inputs
      let currentBodyType;
      if (isWeightLoss) {
        currentBodyType = metricsData.gender === 'male' ? 'bulky' : 'toned';
      } else {
        currentBodyType = 'slim';
      }

      // Select appropriate body type images
      let currentBodyImage, resultBodyImage;
      
      try {
        // Try to load local assets first
        currentBodyImage = bodyTypeImages[metricsData.gender][currentBodyType];
        resultBodyImage = bodyTypeImages[metricsData.gender][metricsData.desiredPhysique];
      } catch (error) {
        // Fallback to URLs if local assets fail
        console.log('Error loading local assets, using fallback URLs:', error);
        currentBodyImage = { uri: fallbackImageUrls[metricsData.gender][currentBodyType] };
        resultBodyImage = { uri: fallbackImageUrls[metricsData.gender][metricsData.desiredPhysique] };
      }

      setTransformation({
        currentBodyImage,
        resultBodyImage,
        currentWeight: metricsData.currentWeight,
        targetWeight: metricsData.targetWeight,
        timeframe: metricsData.timeframe
      });
      
    } catch (error) {
      console.error('Error generating transformation:', error);
      setError('Failed to generate transformation visualization');
    }
  };
  
  // Generate AI transformation using external service
  const generateAITransformation = async () => {
    if (!metricsData) return;
    
    setGeneratingAI(true);
    setError(null);
    
    try {
      const result = await bodyTransformationService.generateBodyTransformation(metricsData);
      
      if (result.success) {
        setTransformation({
          currentBodyImage: { uri: result.currentImage },
          resultBodyImage: { uri: result.resultImage },
          currentWeight: metricsData.currentWeight,
          targetWeight: metricsData.targetWeight,
          timeframe: metricsData.timeframe,
          isAIGenerated: true
        });
      } else {
        setError(result.error || 'Failed to generate AI transformation');
        // Fall back to basic transformation
        generateTransformation();
      }
    } catch (error) {
      console.error('Error generating AI transformation:', error);
      setError('Failed to generate AI transformation');
      // Fall back to basic transformation
      generateTransformation();
    } finally {
      setGeneratingAI(false);
    }
  };
  
  // Pick an image from camera roll
  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      setError('Permission to access camera roll is required!');
      return;
    }
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setUserPhoto(result.assets[0].uri);
        setPersonalMode(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setError('Failed to pick image');
    }
  };
  
  // Generate personalized transformation
  const generatePersonalTransformation = async () => {
    if (!userPhoto || !metricsData) return;
    
    setGeneratingAI(true);
    setError(null);
    
    try {
      const result = await bodyTransformationService.generatePersonalizedTransformation(userPhoto, metricsData);
      
      if (result.success) {
        setPersonalTransformation({
          currentImageUri: result.currentImageUri,
          transformedImageUri: result.transformedImageUri,
          analysis: result.analysis
        });
        
        if (onPersonalTransformation) {
          onPersonalTransformation(result);
        }
      } else {
        setError(result.error || 'Failed to generate personalized transformation');
        setPersonalMode(false);
        // Fall back to basic transformation
        generateTransformation();
      }
    } catch (error) {
      console.error('Error generating personalized transformation:', error);
      setError('Failed to generate personalized transformation');
      setPersonalMode(false);
      // Fall back to basic transformation
      generateTransformation();
    } finally {
      setGeneratingAI(false);
    }
  };
  
  // Reset personal mode
  const resetPersonalMode = () => {
    setPersonalMode(false);
    setUserPhoto(null);
    setPersonalTransformation(null);
    generateTransformation();
  };

  if (loading || generatingAI) {
    return (
      <Card style={styles.container}>
        <Card.Content style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>
            {generatingAI 
              ? 'Generating AI-powered transformation...' 
              : 'Preparing your transformation preview...'}
          </Text>
        </Card.Content>
      </Card>
    );
  }

  if (error) {
    return (
      <Card style={styles.container}>
        <Card.Content style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            mode="contained" 
            onPress={generateTransformation}
            style={styles.retryButton}
          >
            Try Again
          </Button>
        </Card.Content>
      </Card>
    );
  }

  if (!transformation && !personalTransformation) {
    return null;
  }
  
  if (personalMode) {
    return (
      <Card style={styles.container}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Your Personal Transformation</Text>
            <TouchableOpacity onPress={resetPersonalMode} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.imagesContainer}>
            <View style={styles.imageColumn}>
              <Text style={styles.imageLabel}>Current</Text>
              <View style={styles.imageWrapper}>
                {userPhoto ? (
                  <Image 
                    source={{ uri: userPhoto }}
                    style={styles.bodyImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <MaterialCommunityIcons name="camera-plus" size={48} color="#9CA3AF" />
                    <Text style={styles.placeholderText}>Tap to upload</Text>
                  </View>
                )}
              </View>
              <Text style={styles.weightText}>{metricsData.currentWeight} kg</Text>
            </View>
            
            <View style={styles.imageColumn}>
              <Text style={styles.imageLabel}>Potential Result</Text>
              <View style={styles.imageWrapper}>
                {personalTransformation ? (
                  <Image 
                    source={{ uri: personalTransformation.transformedImageUri }}
                    style={styles.bodyImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <MaterialCommunityIcons name="image-filter" size={48} color="#9CA3AF" />
                    <Text style={styles.placeholderText}>Transform Image</Text>
                  </View>
                )}
              </View>
              <Text style={styles.weightText}>{metricsData.targetWeight} kg</Text>
            </View>
          </View>
          
          {personalTransformation ? (
            <View style={styles.analysisContainer}>
              <Text style={styles.analysisLabel}>AI Analysis:</Text>
              <View style={styles.analysisList}>
                <View style={styles.analysisItem}>
                  <MaterialCommunityIcons name="fire" size={16} color="#F59E0B" />
                  <Text style={styles.analysisText}>Body Fat Reduction: {personalTransformation.analysis.bodyFatReduction}</Text>
                </View>
                <View style={styles.analysisItem}>
                  <MaterialCommunityIcons name="arm-flex" size={16} color="#10B981" />
                  <Text style={styles.analysisText}>Muscle Gain: {personalTransformation.analysis.muscleGain}</Text>
                </View>
                <View style={styles.analysisItem}>
                  <MaterialCommunityIcons name="calendar-clock" size={16} color="#4F46E5" />
                  <Text style={styles.analysisText}>Time to Achieve: {personalTransformation.analysis.timeToAchieve}</Text>
                </View>
              </View>
            </View>
          ) : (
            <Button 
              mode="contained" 
              icon="camera"
              onPress={userPhoto ? generatePersonalTransformation : pickImage}
              style={styles.uploadButton}
            >
              {userPhoto ? 'Generate My Transformation' : 'Upload Your Photo'}
            </Button>
          )}
          
          <Text style={styles.disclaimer}>
            Note: This is an AI-powered visualization for motivation only.
            Individual results will vary based on genetics, diet, exercise, and other factors.
          </Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Text style={styles.title}>Your Potential Transformation</Text>
        
        <View style={styles.imagesContainer}>
          <View style={styles.imageColumn}>
            <Text style={styles.imageLabel}>Current</Text>
            <View style={styles.imageWrapper}>
              <Image 
                source={transformation.currentBodyImage}
                style={styles.bodyImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.weightText}>{transformation.currentWeight} kg</Text>
          </View>
          
          <View style={styles.imageColumn}>
            <Text style={styles.imageLabel}>Potential Result</Text>
            <View style={styles.imageWrapper}>
              <Image 
                source={transformation.resultBodyImage}
                style={styles.bodyImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.weightText}>{transformation.targetWeight} kg</Text>
          </View>
        </View>
        
        <View style={styles.buttonRow}>
          {!transformation.isAIGenerated && (
            <Button 
              mode="contained" 
              icon="robot"
              onPress={generateAITransformation}
              style={styles.aiButton}
            >
              Generate AI Version
            </Button>
          )}
          
          <Button 
            mode="outlined" 
            icon="camera"
            onPress={pickImage}
            style={transformation.isAIGenerated ? styles.uploadButton : styles.personalButton}
          >
            Use My Photo
          </Button>
        </View>
        
        <View style={styles.timeframeContainer}>
          <Text style={styles.timeframeLabel}>Estimated timeframe:</Text>
          <Text style={styles.timeframeValue}>{transformation.timeframe} weeks</Text>
        </View>
        
        {transformation.isAIGenerated && (
          <Text style={styles.aiGeneratedText}>
            This visualization was generated with AI based on your metrics.
          </Text>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  closeButton: {
    padding: 4,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  imageColumn: {
    alignItems: 'center',
    width: '45%',
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  imageWrapper: {
    width: '100%',
    height: 320,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  bodyImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  placeholderText: {
    marginTop: 8,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  weightText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  aiButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#8B5CF6',
  },
  personalButton: {
    flex: 1,
    marginLeft: 8,
  },
  uploadButton: {
    flex: 1,
  },
  timeframeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  timeframeLabel: {
    fontSize: 14,
    marginRight: 6,
  },
  timeframeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  aiGeneratedText: {
    fontSize: 12,
    color: '#8B5CF6',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    marginTop: 8,
  },
  analysisContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  analysisLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  analysisList: {
    marginTop: 4,
  },
  analysisItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  analysisText: {
    marginLeft: 8,
    fontSize: 14,
  },
  disclaimer: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  }
});

export default EnhancedBodyTransformationVisual;