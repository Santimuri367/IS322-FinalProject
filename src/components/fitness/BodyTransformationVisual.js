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
import bodyTransformationService from '../../services/bodyTransformationService';

/**
 * BodyTransformationVisual - Component that displays before/after body transformation images
 * This version uses DALL-E for AI image generation
 */
function BodyTransformationVisual({ metricsData, loading = false }) {
  const theme = useTheme();
  const [transformation, setTransformation] = useState(null);
  const [error, setError] = useState(null);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  useEffect(() => {
    if (!metricsData || loading) {
      return;
    }

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

      // Set up the basic transformation data with placeholders
      setTransformation({
        currentBodyType: currentBodyType,
        resultBodyType: metricsData.desiredPhysique,
        gender: metricsData.gender,
        currentWeight: metricsData.currentWeight,
        targetWeight: metricsData.targetWeight,
        timeframe: metricsData.timeframe,
        dalleImage: null
      });
      
    } catch (error) {
      console.error('Error setting up transformation:', error);
      setError('Failed to set up transformation visualization');
    }
  }, [metricsData, loading]);

  // Helper function to get color based on body type and gender
  const getBodyColor = (gender, bodyType) => {
    // Male colors - different shades of blue
    if (gender === 'male') {
      switch (bodyType) {
        case 'slim': return '#93C5FD'; // Lighter blue
        case 'athletic': return '#60A5FA'; // Medium blue
        case 'muscular': return '#3B82F6'; // Bright blue
        case 'bulky': return '#1D4ED8'; // Darker blue
        default: return '#3B82F6';
      }
    } 
    // Female colors - different shades of teal/green
    else {
      switch (bodyType) {
        case 'slim': return '#A7F3D0'; // Lighter green
        case 'athletic': return '#6EE7B7'; // Medium green
        case 'toned': return '#10B981'; // Bright green
        case 'muscular': return '#047857'; // Darker green
        default: return '#10B981';
      }
    }
  };

  // Get body silhouette icon based on gender and type
  const getBodyIcon = (gender, bodyType) => {
    // Use different icon based on gender and body type
    if (gender === 'male') {
      switch (bodyType) {
        case 'slim': return 'human-male';
        case 'athletic': return 'human-male';
        case 'muscular': return 'arm-flex';
        case 'bulky': return 'arm-flex';
        default: return 'human-male';
      }
    } else {
      switch (bodyType) {
        case 'slim': return 'human-female';
        case 'athletic': return 'human-female';
        case 'toned': return 'human-female';
        case 'muscular': return 'arm-flex';
        default: return 'human-female';
      }
    }
  };
  
  // Generate AI transformation using DALL-E
  const generateAITransformation = async () => {
    if (!metricsData) return;
    
    setGeneratingAI(true);
    setError(null);
    
    try {
      const result = await bodyTransformationService.generateTransformation(metricsData);
      
      if (result.success) {
        setTransformation(prev => ({
          ...prev,
          dalleImage: `data:image/png;base64,${result.imageData}`,
          aiGenerated: true
        }));
        setShowPlaceholder(false);
      } else {
        setError(result.error || 'Failed to generate AI transformation');
        // Keep showing the placeholders
        setShowPlaceholder(true);
      }
    } catch (error) {
      console.error('Error generating AI transformation:', error);
      setError('Failed to generate AI transformation');
      // Keep showing the placeholders
      setShowPlaceholder(true);
    } finally {
      setGeneratingAI(false);
    }
  };
  
  // Generate separate before and after images
  const generateSeparateImages = async () => {
    if (!metricsData) return;
    
    setGeneratingAI(true);
    setError(null);
    
    try {
      const result = await bodyTransformationService.generateSeparateImages(metricsData);
      
      if (result.success) {
        setTransformation(prev => ({
          ...prev,
          beforeImage: `data:image/png;base64,${result.beforeImageData}`,
          afterImage: `data:image/png;base64,${result.afterImageData}`,
          dalleImage: null, // Clear the single transformation image
          aiGenerated: true,
          separateImages: true
        }));
        setShowPlaceholder(false);
      } else {
        setError(result.error || 'Failed to generate separate transformation images');
        // Keep showing the placeholders
        setShowPlaceholder(true);
      }
    } catch (error) {
      console.error('Error generating separate AI transformations:', error);
      setError('Failed to generate separate transformation images');
      // Keep showing the placeholders
      setShowPlaceholder(true);
    } finally {
      setGeneratingAI(false);
    }
  };

  if (loading || generatingAI) {
    return (
      <Card style={styles.container}>
        <Card.Content style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>
            {generatingAI 
              ? 'Generating AI transformation using DALL-E...' 
              : 'Preparing your transformation preview...'}
          </Text>
          <Text style={styles.subLoadingText}>
            This may take up to 30 seconds
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
            onPress={() => setShowPlaceholder(true)}
            style={styles.retryButton}
          >
            Show Placeholder Transformation
          </Button>
        </Card.Content>
      </Card>
    );
  }

  if (!transformation) {
    return null;
  }
  
  // Render with DALL-E generated image
  if (transformation.dalleImage && !showPlaceholder) {
    return (
      <Card style={styles.container}>
        <Card.Content>
          <Text style={styles.title}>Your Potential Transformation</Text>
          
          <View style={styles.dalleImageContainer}>
            <Image 
              source={{ uri: transformation.dalleImage }} 
              style={styles.dalleImage}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.weightLabelsContainer}>
            <Text style={styles.weightLabel}>{transformation.currentWeight} kg</Text>
            <Text style={styles.weightLabel}>{transformation.targetWeight} kg</Text>
          </View>
          
          <View style={styles.timeframeContainer}>
            <Text style={styles.timeframeLabel}>Estimated timeframe:</Text>
            <Text style={styles.timeframeValue}>{transformation.timeframe} weeks</Text>
          </View>
          
          <Text style={styles.aiGeneratedText}>
            This transformation was generated with AI using DALL-E
          </Text>
          
          <Button 
            mode="outlined" 
            onPress={() => setShowPlaceholder(true)}
            style={styles.switchButton}
            icon="refresh"
          >
            Switch to Simple View
          </Button>
        </Card.Content>
      </Card>
    );
  }
  
  // Render with separate DALL-E generated before/after images
  if (transformation.beforeImage && transformation.afterImage && !showPlaceholder) {
    return (
      <Card style={styles.container}>
        <Card.Content>
          <Text style={styles.title}>Your Potential Transformation</Text>
          
          <View style={styles.imagesContainer}>
            <View style={styles.imageColumn}>
              <Text style={styles.imageLabel}>Current</Text>
              <View style={styles.separateImageWrapper}>
                <Image 
                  source={{ uri: transformation.beforeImage }}
                  style={styles.bodyImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.weightText}>{transformation.currentWeight} kg</Text>
            </View>
            
            <View style={styles.imageColumn}>
              <Text style={styles.imageLabel}>Potential Result</Text>
              <View style={styles.separateImageWrapper}>
                <Image 
                  source={{ uri: transformation.afterImage }}
                  style={styles.bodyImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.weightText}>{transformation.targetWeight} kg</Text>
            </View>
          </View>
          
          <View style={styles.timeframeContainer}>
            <Text style={styles.timeframeLabel}>Estimated timeframe:</Text>
            <Text style={styles.timeframeValue}>{transformation.timeframe} weeks</Text>
          </View>
          
          <Text style={styles.aiGeneratedText}>
            This transformation was generated with AI using DALL-E
          </Text>
          
          <Button 
            mode="outlined" 
            onPress={() => setShowPlaceholder(true)}
            style={styles.switchButton}
            icon="refresh"
          >
            Switch to Simple View
          </Button>
        </Card.Content>
      </Card>
    );
  }

  // Render placeholder version with colored silhouettes
  return (
    <Card style={styles.container}>
      <Card.Content>
        <Text style={styles.title}>Your Potential Transformation</Text>
        
        <View style={styles.imagesContainer}>
          <View style={styles.imageColumn}>
            <Text style={styles.imageLabel}>Current</Text>
            {/* Body silhouette with color instead of an image */}
            <View style={styles.imageWrapperOuter}>
              <View style={[
                styles.imageWrapper, 
                {backgroundColor: getBodyColor(transformation.gender, transformation.currentBodyType)}
              ]}>
                <MaterialCommunityIcons 
                  name={getBodyIcon(transformation.gender, transformation.currentBodyType)} 
                  size={120} 
                  color="white" 
                  style={styles.bodyIcon}
                />
              </View>
            </View>
            <Text style={styles.weightText}>{transformation.currentWeight} kg</Text>
          </View>
          
          <View style={styles.imageColumn}>
            <Text style={styles.imageLabel}>Potential Result</Text>
            {/* Body silhouette with color instead of an image */}
            <View style={styles.imageWrapperOuter}>
              <View style={[
                styles.imageWrapper, 
                {backgroundColor: getBodyColor(transformation.gender, transformation.resultBodyType)}
              ]}>
                <MaterialCommunityIcons 
                  name={getBodyIcon(transformation.gender, transformation.resultBodyType)} 
                  size={120} 
                  color="white" 
                  style={styles.bodyIcon}
                />
              </View>
            </View>
            <Text style={styles.weightText}>{transformation.targetWeight} kg</Text>
          </View>
        </View>
        
        <View style={styles.timeframeContainer}>
          <Text style={styles.timeframeLabel}>Estimated timeframe:</Text>
          <Text style={styles.timeframeValue}>{transformation.timeframe} weeks</Text>
        </View>
        
        <Text style={styles.disclaimerText}>
          This is a visualization based on average transformations. 
          Individual results may vary depending on factors like genetics, 
          consistency with your workout plan, and nutrition.
        </Text>
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={generateAITransformation}
            style={styles.aiButton}
            icon="image"
          >
            Generate Realistic AI Image
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={generateSeparateImages}
            style={styles.separateButton}
            icon="image-multiple"
          >
            Generate Before/After Images
          </Button>
        </View>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
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
  // Outer wrapper to handle shadow correctly
  imageWrapperOuter: {
    width: '100%',
    height: 320,
    borderRadius: 8,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  // Inner wrapper for the colored background and icon
  imageWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bodyIcon: {
    opacity: 0.8,
  },
  separateImageWrapper: {
    width: '100%',
    height: 320,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  dalleImageContainer: {
    width: '100%',
    height: 400,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  dalleImage: {
    width: '100%',
    height: '100%',
  },
  bodyImage: {
    width: '100%',
    height: '100%',
  },
  weightText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  weightLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  weightLabel: {
    fontSize: 16,
    fontWeight: 'bold',
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
  disclaimerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  aiGeneratedText: {
    fontSize: 12,
    color: '#4F46E5',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 16,
  },
  aiButton: {
    marginBottom: 8,
    backgroundColor: '#8B5CF6',
  },
  separateButton: {
    marginBottom: 8,
  },
  switchButton: {
    marginTop: 8,
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
  subLoadingText: {
    marginTop: 8,
    fontSize: 12,
    color: '#9CA3AF',
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
  }
});

export default BodyTransformationVisual;