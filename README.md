# FitCoach AI

FitCoach AI is a React Native mobile application that provides personalized fitness and nutrition coaching using artificial intelligence. It offers customized workout plans, meal guidance, body transformation visualization, progress tracking, and AI-powered reminders to help users reach their fitness goals.

## 📱 App Features

- **Personalized Fitness Plans**: Custom workouts based on goals, fitness level, and available equipment
- **Nutrition Guidance**: Meal recommendations tailored to dietary preferences
- **Body Transformation Visualization**: AI-powered visualization of potential body changes using DALL-E
- **Progress Tracking**: Monitor workouts completed, meals followed, and body metrics
- **AI Coach**: Chat with an AI coach for fitness and nutrition advice
- **Workout Planner**: Design custom workout routines by day of the week
- **AI-Powered Reminders**: Personalized notifications to keep you on track

## 🛠️ Technology Stack

- **Frontend**: React Native with Expo
- **UI Components**: React Native Paper
- **Navigation**: React Navigation v7
- **State Management**: React Context API
- **Storage**: AsyncStorage for local data persistence
- **AI Services**: OpenAI GPT-4 and DALL-E APIs
- **Icons**: MaterialCommunityIcons via react-native-vector-icons

## 📋 Prerequisites

Before getting started, make sure you have the following installed:

- [Node.js]
- [npm]
- (`npm install -g expo-cli`)
- [Git]
- [Xcode]
- [OpenAI API key]


### Setting up Environment Variables

Create a `.env` file in the root directory:

OPENAI_API_KEY=your_openai_api_key_here

### Running the App

# Start the Expo development server
expo start

# Run on iOS simulator
expo run:ios

# Run on Android simulator
expo run:android

# Run on web
expo start --web
```

## 📁 Project Structure

```
fitcoachai/
├── App.js                   # Main application component
├── app.json                 # Expo configuration
├── package.json             
├── package-lock.json        
├── assets/                  # Static assets
│   ├── icon.png             # App icon
│   ├── splash.png           # Splash screen
│   └── body_samples/        # Body transformation images
├── src/                     # Source code
│   ├── components/          # Reusable components
│   │   ├── dashboard/       # Dashboard components
│   │   └── DashboardCard.js 
│   │   └── ProgressTracker.js 
│   │   ├── fitness/         # Fitness-related components
│   │   └── BodyTransformationVisual.js 
│   │   └── EnhancedBodyTransformationVisul.js 
│   │   └── ExerciseItem.js 
│   │   └── WorkoutCard.js 
│   │   ├── nutrition/       # Nutrition-related components
│   │   └── MealCard.js
│   │   └── NutritionBreakdown.js  
│   │   └── ui/              # UI components
│   │   └── AppHeader.js 
│   │   └── GradientCard.js 
│   │   └── ImageBackground.js 
│   │   └── ProgressCircle.js 
│   ├── context/             # React context providers
│   │   └── UserContext.js   # User data and preferences context
│   ├── hooks/               # Custom React hooks
│   │   └── useAsyncStorage.js # Hook for AsyncStorage operations
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigator.js  # App navigation structure
│   ├── screens/             # App screens
│   │   ├── Dashboard.js     # Main dashboard screen
│   │   ├── FitnessHub.js    # Fitness section main screen
│   │   ├── NutritionHub.js  # Nutrition section main screen
│   │   └── BodyTransformationScreen.js
│   │   └── ChatbotScreen.js
│   │   └── ExerciseLibraryScreen.js
│   │   └── MealPlannerScreen.js
│   │   └── NotificationSetupScreen.js
│   │   └── Onboarding.js
│   │   └── ProgressTrackingScreen.js
│   │   └── WorkoutPlannerScreen.js                
│   ├── services/            # External API services
│   │   ├── bodyTransformationService.js # DALL-E service
│   │   ├── openAIService.js # OpenAI GPT service
│   │   └── reminderService.js # AI reminder service
│   │   └── bodyAiservice.js 
│   └── utils/               # Utility functions and data
│       ├── helpers.js       # Helper functions
│       ├── sampleData.js    # Demo data for development
│       └── samplePreferences.js # Demo user preferences
└── index.js                 # Entry point
```

## 🧩 Core Components

### Screens

- **Onboarding**: Collects user preferences and goals
- **Dashboard**: Overview of daily plan and progress
- **NutritionHub**: Meal plans and nutritional information
- **FitnessHub**: Workout plans and exercise guidance
- **ProgressTrackerScreen**: Track fitness and nutritional progress
- **BodyTransformationScreen**: Visualize potential fitness transformations with AI
- **ChatbotScreen**: Interact with the AI coach
- **WorkoutPlannerScreen**: Create custom workout routines
- **NotificationSetupScreen**: Configure AI-powered reminders

### Components

- **ProgressTracker**: Visualizes user progress over time
- **BodyTransformationVisual**: Generates AI body transformation images
- **MealCard**: Displays meal information and nutrition facts
- **WorkoutCard**: Shows workout details and exercises
- **ExerciseItem**: Individual exercise component
- **NutritionBreakdown**: Visual breakdown of macronutrients
- **ProgressCircle**: Circular progress indicator

### Services

- **openAIService**: Handles GPT-4 interactions for personalized content
- **bodyTransformationService**: Manages DALL-E API calls for body visualizations
- **reminderService**: Generates AI-powered notification content

## ⚙️ Configuration Options

### Fitness Goals

- Weight Loss
- Muscle Building
- Improved Fitness
- Better Health

### Fitness Levels

- Beginner
- Intermediate
- Advanced

### Equipment Options

- No Equipment (Bodyweight)
- Minimal Equipment
- Home Gym
- Full Gym

### Dietary Preferences

- Vegetarian
- Vegan
- Gluten-Free
- Dairy-Free
- Keto
- Paleo
- No Restrictions

## 🔄 Data Flow

1. **User Registration**: Collects user preferences during onboarding
2. **Plan Generation**: Creates personalized fitness and nutrition plans
3. **Daily Usage**: User follows workout and meal plans
4. **Progress Tracking**: App records completed workouts and meals
5. **AI Feedback**: Provides insights and adjustments based on progress
6. **Visualization**: Shows potential body transformation based on goals

## 🔌 API Integration

### OpenAI GPT-4

Used for generating:
- Personalized workout recommendations
- Customized meal plans
- Progress feedback and insights
- Chat responses from the AI coach
- Reminder message content

### OpenAI DALL-E

Used for generating:
- Body transformation visualizations
- Before/after fitness projections

## 📱 How to Use the App

### Onboarding

1. Launch the app and complete the onboarding questionnaire
2. Specify your fitness goals, level, equipment, and dietary preferences
3. Set your time availability for workouts and meal prep

### Dashboard

- View your daily workout and meal plans
- Check your progress toward your goals
- Get AI feedback on your performance

### Fitness Features

- Access your personalized workout plan
- Browse the exercise library for form guidance
- Create custom workout routines with the Workout Planner
- Track your workout progress

### Nutrition Features

- View your daily meal recommendations
- See nutritional breakdowns of each meal
- Plan custom meal schedules
- Track your nutrition adherence

### Body Transformation

1. Enter your current metrics (height, weight, body fat %)
2. Specify your target weight and desired physique
3. Set a realistic timeframe
4. Generate AI visualization of potential transformation
5. Get personalized recommendations

### AI Reminders

1. Enable AI-powered reminders
2. Set your preferred days and times
3. Choose notification types (push, email, or both)
4. Customize the tone and content of your reminders
5. Preview what your personalized reminders will look like

### Progress Tracking

- Log completed workouts and followed meals
- Track body measurements and weight changes
- View progress charts and statistics
- Get AI analysis of your fitness journey

## 🔧 Common Commands

```bash
# Install dependencies
npm install
# or
yarn

# Start development server
expo start

# Start with clear cache (if experiencing issues)
expo start --clear

# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Update Expo SDK
expo upgrade

# Check package dependencies
npm outdated
# or
yarn outdated

# Run linting
npm run lint
# or
yarn lint
```

## 🤝 Using AI Features

### Body Transformation Visualization

The app uses DALL-E to generate personalized body transformation images. To use this feature:

1. Navigate to the Body Transformation screen
2. Enter your current metrics
3. Set your target weight and physique goals
4. Choose a timeframe
5. Tap "Generate Transformation"
6. For AI-generated images, tap "Generate Realistic AI Image"

### AI Coach Chat

Interact with the AI coach by:

1. Navigating to the AI Coach tab
2. Typing your fitness or nutrition question
3. Receiving personalized responses from the AI

### AI Reminder Setup

Create personalized reminders:

1. Go to Notification Setup via the Workout Planner
2. Enable AI Reminders
3. Configure timing and frequency
4. Choose your preferred tone and style
5. Preview and confirm your reminder setup

## ⚠️ Known Issues and Limitations

- **Image Generation**: DALL-E API calls may occasionally fail or time out
- **Offline Usage**: AI features require an internet connection
- **Notification Handling**: Actual notification delivery varies by device
- **Performance**: Heavy AI use may impact battery life
- **Data Usage**: AI image generation can consume significant data

## 💡 Advanced Usage Tips

- For more accurate body transformations, include current body fat percentage
- Schedule workouts at consistent times to build habit consistency
- Enable progress stats in reminders to stay motivated
- When chatting with the AI coach, be specific about your goals
- Use Week View in Workout Planner for better weekly balance
- Combine cardio and strength training for optimal results

## 🔒 Security Considerations

- The app stores user data locally using AsyncStorage
- API keys should be properly secured and not hardcoded
- No personally identifiable information is sent to external services
- Body images are processed within the app and not stored externally

## 🛣️ Future Development Roadmap

- Integration with fitness wearables for automated tracking
- Social features for community motivation
- Video demonstrations of exercises
- Voice-guided workouts
- Expanded nutrition database
- Barcode scanner for meal tracking
- Advanced metrics and analytics

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- OpenAI for providing the GPT and DALL-E APIs
- The React Native and Expo communities
- All contributors and testers