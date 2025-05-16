import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { 
  Title, 
  Text, 
  Button, 
  Card, 
  Divider, 
  useTheme,
  TextInput,
  SegmentedButtons,
  RadioButton
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import BodyTransformationVisual from '../components/fitness/BodyTransformationVisual';

function BodyTransformationScreen({ navigation }) {
  const theme = useTheme();
  const { userPreferences } = useUser();
  
  const [gender, setGender] = useState('male');
  const [currentHeight, setCurrentHeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [desiredPhysique, setDesiredPhysique] = useState(gender === 'male' ? 'athletic' : 'toned');
  const [timeframe, setTimeframe] = useState('12');
  
  const [loading, setLoading] = useState(false);
  const [transformationResult, setTransformationResult] = useState(null);
  
  // Update desired physique options when gender changes
  React.useEffect(() => {
    setDesiredPhysique(gender === 'male' ? 'athletic' : 'toned');
  }, [gender]);
  
  const renderMetricsForm = () => (
    <View style={styles.metricsForm}>
      <SegmentedButtons
        value={gender}
        onValueChange={setGender}
        buttons={[
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' }
        ]}
        style={styles.segmentedButton}
      />
      
      <TextInput
        label="Current Height (cm)"
        value={currentHeight}
        onChangeText={setCurrentHeight}
        style={styles.input}
        keyboardType="numeric"
      />
      
      <TextInput
        label="Current Weight (kg)"
        value={currentWeight}
        onChangeText={setCurrentWeight}
        style={styles.input}
        keyboardType="numeric"
      />
      
      <TextInput
        label="Target Weight (kg)"
        value={targetWeight}
        onChangeText={setTargetWeight}
        style={styles.input}
        keyboardType="numeric"
      />
      
      <TextInput
        label="Current Body Fat % (optional)"
        value={bodyFat}
        onChangeText={setBodyFat}
        style={styles.input}
        keyboardType="numeric"
      />
      
      <Text style={styles.sectionTitle}>Desired Physique</Text>
      <RadioButton.Group
        onValueChange={value => setDesiredPhysique(value)}
        value={desiredPhysique}
      >
        {gender === 'male' ? (
          <>
            <View style={styles.radioRow}>
              <RadioButton value="slim" />
              <Text style={styles.radioLabel}>Slim & Lean</Text>
            </View>
            <View style={styles.radioRow}>
              <RadioButton value="athletic" />
              <Text style={styles.radioLabel}>Athletic Build</Text>
            </View>
            <View style={styles.radioRow}>
              <RadioButton value="muscular" />
              <Text style={styles.radioLabel}>Muscular</Text>
            </View>
            <View style={styles.radioRow}>
              <RadioButton value="bulky" />
              <Text style={styles.radioLabel}>Bulky/Powerlifter</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.radioRow}>
              <RadioButton value="slim" />
              <Text style={styles.radioLabel}>Slim</Text>
            </View>
            <View style={styles.radioRow}>
              <RadioButton value="athletic" />
              <Text style={styles.radioLabel}>Athletic</Text>
            </View>
            <View style={styles.radioRow}>
              <RadioButton value="toned" />
              <Text style={styles.radioLabel}>Toned</Text>
            </View>
            <View style={styles.radioRow}>
              <RadioButton value="muscular" />
              <Text style={styles.radioLabel}>Muscular</Text>
            </View>
          </>
        )}
      </RadioButton.Group>
      
      <Text style={styles.sectionTitle}>Timeframe (weeks)</Text>
      <SegmentedButtons
        value={timeframe}
        onValueChange={setTimeframe}
        buttons={[
          { value: '8', label: '8' },
          { value: '12', label: '12' },
          { value: '16', label: '16' },
          { value: '24', label: '24' }
        ]}
        style={styles.segmentedButton}
      />
    </View>
  );
  
  const generateTransformation = async () => {
    // Validate inputs
    if (!currentHeight || !currentWeight || !targetWeight) {
      Alert.alert('Missing Information', 'Please enter your current height, current weight, and target weight.');
      return;
    }
    
    // Validate numeric inputs
    if (isNaN(parseFloat(currentHeight)) || isNaN(parseFloat(currentWeight)) || isNaN(parseFloat(targetWeight))) {
      Alert.alert('Invalid Input', 'Please enter valid numeric values for height and weight.');
      return;
    }
    
    // Validate reasonable weight values
    if (parseFloat(currentWeight) < 30 || parseFloat(currentWeight) > 250 || 
        parseFloat(targetWeight) < 30 || parseFloat(targetWeight) > 250) {
      Alert.alert('Invalid Weight', 'Please enter reasonable weight values between 30kg and 250kg.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create metrics data object for passing to the visualization component
      const metricsData = {
        gender,
        currentHeight: parseFloat(currentHeight),
        currentWeight: parseFloat(currentWeight),
        targetWeight: parseFloat(targetWeight),
        bodyFat: bodyFat ? parseFloat(bodyFat) : null,
        desiredPhysique,
        timeframe: parseInt(timeframe)
      };
      
      // Mock delay to simulate API call for generating recommendations
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate transformation recommendations
      const weightChange = parseFloat(targetWeight) - parseFloat(currentWeight);
      const isWeightLoss = weightChange < 0;
      const changeAmount = Math.abs(weightChange).toFixed(1);
      
      // Set the transformation result
      setTransformationResult({
        metricsData,
        expectedChanges: [
          `Potential ${isWeightLoss ? 'reduction' : 'gain'} of ${changeAmount} kg`,
          `${isWeightLoss ? 'Decreased' : 'Increased'} body ${isWeightLoss ? 'fat percentage' : 'muscle mass'}`,
          `More defined ${desiredPhysique} physique`,
          "Improved overall body proportions"
        ],
        recommendations: [
          `${isWeightLoss ? 'Maintain a calorie deficit' : 'Consume a calorie surplus'} of 300-500 calories ${isWeightLoss ? 'below' : 'above'} maintenance`,
          `Focus on high-protein foods (1.6-2.2g per kg of bodyweight)`,
          `Incorporate strength training 3-4 times per week`,
          `${isWeightLoss ? 'Add 2-3 cardio sessions weekly' : 'Ensure adequate recovery between workouts'}`,
          `Stay consistent - this transformation will take approximately ${timeframe} weeks`
        ]
      });
    } catch (error) {
      console.error('Error generating transformation:', error);
      Alert.alert(
        'Error',
        'Failed to generate transformation. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <Title style={styles.heading}>Body Transformation</Title>
          
          <Text style={styles.description}>
            See how your body could transform based on your goals.
            Enter your metrics to visualize your potential future physique.
          </Text>
          
          {/* Wrap Card content in a View with overflow style to fix the warning */}
          <View style={styles.cardOuterWrapper}>
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Your Body Metrics</Title>
                {renderMetricsForm()}
                
                <Button 
                  mode="contained" 
                  icon="auto-fix" 
                  onPress={generateTransformation}
                  style={styles.generateButton}
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate Transformation'}
                </Button>
              </Card.Content>
            </Card>
          </View>
          
          {transformationResult && (
            <>
              {/* Using the BodyTransformationVisual component */}
              <BodyTransformationVisual 
                metricsData={transformationResult.metricsData} 
                loading={loading}
              />
              
              {/* Wrap Card content in a View with overflow style to fix the warning */}
              <View style={styles.cardOuterWrapper}>
                <Card style={styles.resultCard}>
                  <Card.Content>
                    <Title style={styles.cardTitle}>AI Analysis</Title>
                    
                    <View style={styles.resultSection}>
                      <Text style={styles.resultLabel}>Estimated timeframe:</Text>
                      <Text style={styles.resultValue}>{transformationResult.metricsData.timeframe} weeks</Text>
                    </View>
                    
                    <View style={styles.resultSection}>
                      <Text style={styles.resultLabel}>Expected changes:</Text>
                      {transformationResult.expectedChanges.map((change, index) => (
                        <View key={index} style={styles.bulletPoint}>
                          <Text style={styles.bulletIcon}>•</Text>
                          <Text style={styles.bulletText}>{change}</Text>
                        </View>
                      ))}
                    </View>
                    
                    <View style={styles.resultSection}>
                      <Text style={styles.resultLabel}>Recommendations:</Text>
                      {transformationResult.recommendations.map((recommendation, index) => (
                        <View key={index} style={styles.bulletPoint}>
                          <Text style={styles.bulletIcon}>•</Text>
                          <Text style={styles.bulletText}>{recommendation}</Text>
                        </View>
                      ))}
                    </View>
                    
                    <Text style={styles.disclaimer}>
                      Note: This is an AI-generated visualization and represents a potential 
                      outcome based on consistent adherence to your fitness and nutrition plan. 
                      Individual results may vary.
                    </Text>
                  </Card.Content>
                </Card>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  // Fix for the shadow warning - use an outer wrapper with visible overflow
  cardOuterWrapper: {
    marginBottom: 16,
    borderRadius: 12, 
    // These shadow styles go on the outer wrapper
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
  card: {
    borderRadius: 12,
    // Remove shadow from card itself
    elevation: 0,
    shadowColor: 'transparent',
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  metricsForm: {
    marginBottom: 16,
  },
  segmentedButton: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 12,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  generateButton: {
    marginTop: 8,
  },
  resultCard: {
    borderRadius: 12,
    // Remove shadow from card itself
    elevation: 0,
    shadowColor: 'transparent',
  },
  resultSection: {
    marginBottom: 16,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 14,
    color: '#4B5563',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bulletIcon: {
    marginRight: 8,
    fontSize: 14,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  disclaimer: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginTop: 16,
  },
});

export default BodyTransformationScreen;