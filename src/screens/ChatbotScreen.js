import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator 
} from 'react-native';
import { TextInput, IconButton, Surface, Text, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import openAIService from '../services/openAIService';

// Message bubble component
const MessageBubble = ({ message, isUser }) => (
  <View style={[
    styles.messageBubble,
    isUser ? styles.userBubble : styles.aiBubble
  ]}>
    <Avatar.Icon 
      size={36} 
      icon={isUser ? 'account' : 'robot'} 
      style={isUser ? styles.userAvatar : styles.aiAvatar}
      color={isUser ? 'white' : '#4F46E5'}
    />
    <Surface style={[
      styles.messageContent,
      isUser ? styles.userContent : styles.aiContent
    ]}>
      <Text style={isUser ? styles.userText : styles.aiText}>
        {message.content}
      </Text>
    </Surface>
  </View>
);

function ChatbotScreen() {
  const { userPreferences } = useUser();
  const [messages, setMessages] = useState([
    { id: '1', content: 'Hi there! I\'m your FitCoach AI assistant. How can I help you with your fitness and nutrition today?', isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const flatListRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Get AI response
      const response = await openAIService.getChatResponse(inputMessage, userPreferences);
      
      // Add AI message
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        isUser: false
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting chat response:', error);
      
      // Add error message
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MessageBubble message={item} isUser={item.isUser} />
          )}
          contentContainerStyle={styles.messageList}
        />
        
        <Surface style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Ask about your fitness or nutrition plan..."
            multiline
            maxLength={500}
            disabled={isLoading}
          />
          {isLoading ? (
            <ActivityIndicator size={24} color="#4F46E5" style={styles.sendButton} />
          ) : (
            <IconButton
              icon="send"
              size={24}
              color="#4F46E5"
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={inputMessage.trim() === ''}
            />
          )}
        </Surface>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  aiBubble: {
    alignSelf: 'flex-start',
  },
  userAvatar: {
    backgroundColor: '#4F46E5',
    marginLeft: 8,
  },
  aiAvatar: {
    backgroundColor: '#EEF2FF',
    marginRight: 8,
  },
  messageContent: {
    padding: 12,
    borderRadius: 16,
  },
  userContent: {
    backgroundColor: '#4F46E5',
    borderBottomRightRadius: 4,
  },
  aiContent: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
  },
  userText: {
    color: 'white',
  },
  aiText: {
    color: '#1F2937',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: 'transparent',
  },
  sendButton: {
    margin: 0,
  },
});

export default ChatbotScreen;