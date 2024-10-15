import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Animated,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // For gradient backgrounds
import { questions } from './questionsData'; // Question data import

const { width } = Dimensions.get('window'); // Screen width for responsive layout

const BingoGame: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [clickedCells, setClickedCells] = useState(Array(9).fill(false));
  const [isGameOver, setIsGameOver] = useState(false);
  const [timer, setTimer] = useState(10);

  const [progress] = useState(new Animated.Value(1)); // Progress animation for timer
  const crownScale = useRef(new Animated.Value(0)).current; // Crown animation reference
  const shakeAnimation = useRef(questions.map(() => new Animated.Value(0))).current; // Shake effect for incorrect answers

  // Check if the game is over
  useEffect(() => {
    if (currentQuestionIndex >= questions.length) {
      setIsGameOver(true);
      Alert.alert('Game Over!', `You answered ${correctCount} out of ${questions.length} correctly.`);
    }
  }, [currentQuestionIndex]);

  // Timer logic and progress animation
  useEffect(() => {
    if (isGameOver) {
      Animated.timing(progress, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false,
      }).start();
      return;
    }

    Animated.timing(progress, {
      toValue: 0,
      duration: 10000,
      useNativeDriver: false,
    }).start();

    const timerInterval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          changeQuestion();
          return 10; // Reset timer
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerInterval);
      progress.setValue(1); // Reset progress animation
    };
  }, [isGameOver, currentQuestionIndex]);

  // Change to the next question
  const changeQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setTimer(10);
    progress.setValue(1); // Reset progress animation
  };

  // Handle cell press
  const handlePress = (index: number) => {
    if (isGameOver || clickedCells[index]) return;

    const isCorrect = questions[index].answer.value === questions[currentQuestionIndex].answer.value;

    if (isCorrect) {
      setClickedCells(prev => {
        const newCells = [...prev];
        newCells[index] = true;
        return newCells;
      });
      animateCrown(); // Trigger crown animation
      setCorrectCount(prev => prev + 1);
    } else {
      triggerShake(index); // Trigger shake animation for incorrect answer
    }

    changeQuestion();
  };

  // Skip to the next question
  const handleSkip = () => {
    changeQuestion();
  };

  // Shake animation for incorrect answers
  const triggerShake = (index: number) => {
    Animated.sequence([
      Animated.timing(shakeAnimation[index], {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation[index], {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation[index], {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Crown animation for correct answers
  const animateCrown = () => {
    Animated.spring(crownScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const crownAnimatedStyle = {
    transform: [{ scale: crownScale }],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Football Bingo</Text>

      <View style={styles.rowContainer}>
        <Text style={styles.timer}>{timer}s</Text>
        <Text style={styles.question} numberOfLines={2} ellipsizeMode="tail">
          {questions[currentQuestionIndex]?.question}
        </Text>
        <View style={styles.right}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
          <Text style={styles.questionCount}>
            {questions.length - currentQuestionIndex} left
          </Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
          ]}
        />
      </View>

      <View style={styles.grid}>
        {questions.map((item, index) => (
          <Animated.View key={item.answer.id} style={{ transform: [{ translateX: shakeAnimation[index] }] }}>
            <TouchableOpacity
              style={[styles.cell, clickedCells[index] && styles.cellClicked]}
              onPress={() => handlePress(index)}
              disabled={isGameOver || clickedCells[index]}
            >
              <LinearGradient
                colors={clickedCells[index] ? ['#FF9800', '#F44336'] : ['#4CAF50', '#388E1F']}
                style={styles.cellGradient}
              >
                {!clickedCells[index] ? (
                  <>
                    <Image source={item.answer.image} style={styles.cellImage} />
                    <Text style={styles.cellText}>{item.answer.value}</Text>
                  </>
                ) : (
                  <Animated.Image
                    source={require('./assets/download.jpeg')}
                    style={[styles.crownImage, crownAnimatedStyle]}
                  />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {isGameOver && (
        <Text style={styles.resultText}>
          You answered {correctCount} out of {questions.length} correctly.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  header: {
    fontSize: 50,
    width: '100%',
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#FFF',
    borderRadius: 4,
    overflow: 'hidden',
    borderColor: '#000',
    borderWidth: 0.5,
    marginBottom: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#36626a',
    borderRadius: 10,
    padding: 10,
  },
  timer: {
    width: '20%',
    fontSize: 30,
    color: 'yellow',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  question: {
    width: '50%',
    fontSize: 28,
    color: '#FFF',
    textAlign: 'center',
    height: 60,
    padding: 8,
    borderRadius: 10,
  },
  right: {
    padding: 10,
    width: '30%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    padding: 7,
    width: '50%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    marginBottom: 5,
  },
  skipButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  questionCount: {
    color: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width,
    justifyContent: 'center',
  },
  crownImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
  cell: {
    width: width * 0.32,
    height: width * 0.32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#36626a',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#97cba9',
    margin: 1,
    overflow: 'hidden',
    position: 'relative',
    elevation: 10,
    shadowColor: '#97cba9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },
  cellGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellImage: {
    width: '70%',
    height: '70%',
    position: 'absolute',
    top: '10%',
    resizeMode: 'contain',
    borderRadius: 40,
  },
  cellText: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 5,
    textAlign: 'center',
    zIndex: 1,
    paddingHorizontal: 5,
  },
  cellClicked: {
    opacity: 0.6,
  },
  resultText: {
    fontSize: 23,
    color: '#36626a',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default BingoGame;
