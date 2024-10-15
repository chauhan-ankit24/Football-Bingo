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
import LinearGradient from 'react-native-linear-gradient'; // Add this library for gradients
import { questions } from './questionsData'; // Import the data
import AnimatedProgressWheel from 'react-native-progress-wheel';
const { width } = Dimensions.get('window');

const BingoGame: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [clickedCells, setClickedCells] = useState(Array(9).fill(false));
  const [isGameOver, setIsGameOver] = useState(false);
  const [timer, setTimer] = useState(10);
  const [progress] = useState(new Animated.Value(1)); // For timer progress animation
  const crownScale = useRef(new Animated.Value(0)).current;



  const shakeAnimation = useRef(questions.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (currentQuestionIndex >= questions.length) {
      setIsGameOver(true);
      Alert.alert('Game Over!', `You answered ${correctCount} out of ${questions.length} correctly.`);
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (isGameOver) {
      // Stop the animation if the game is over
      Animated.timing(progress, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false,
      }).start();
      return; // Exit the effect if the game is over
    }

    // Start the animation for the progress bar
    Animated.timing(progress, {
      toValue: 0,
      duration: 10000,
      useNativeDriver: false,
    }).start();

    // Timer logic
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

    // Cleanup function
    return () => {
      clearInterval(timerInterval);
      // Optionally reset progress if necessary
      progress.setValue(1); // Reset progress if needed
    };
  }, [isGameOver, currentQuestionIndex]);


  const changeQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    setTimer(10);
    progress.setValue(1); // Reset progress animation
  };

  const handlePress = (index: number) => {
    if (isGameOver || clickedCells[index]) { return }

    const isCorrect = questions[index].answer.value === questions[currentQuestionIndex].answer.value;

    if (isCorrect) {
      setClickedCells(prev => {
        const newClickedCells = [...prev];
        newClickedCells[index] = true;
        return newClickedCells;
      });

      animateCrown();
      setCorrectCount(prev => prev + 1);
    } else {
      triggerShake(index);
    }

    changeQuestion();
  };

  const handleSkip = () => {
    changeQuestion(); // Simply call the same function to skip to the next question
  };

  const triggerShake = (index: number) => {
    Animated.sequence([
      Animated.timing(shakeAnimation[index], {
        toValue: 10, // Shift to the right
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation[index], {
        toValue: -10, // Shift to the left
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation[index], {
        toValue: 0, // Reset position
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

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

      {/* <Progress.Bar progress={0.3} width={200} /> */}
      {/* <Progress.Pie progress={0.4} size={50} /> */}
      {/* <Progress.Circle size={30} indeterminate={true} /> */}
      {/* <Progress.CircleSnail color={['red', 'green', 'blue']} /> */}
      {/* <Progress.Pie
        progress={0.4} // 40% progress
        size={100} // Diameter of the circle
        // thickness={8} // Inner circle thickness
        color="#3498db" // Circle color (blue)
        // textStyle={styles.text} // Custom text style
        strokeCap="round" // Round edges for the circle stroke
        direction="clockwise" // Progress direction
        fill="#ecf0f1" // Fill color of the inner circle
        formatText={(progress) => `${Math.round(progress * 100)}%`} // Display percentage text
      /> */}

      <AnimatedProgressWheel
        size={100}
        width={5}
        max={10}
        duration={11000}
        progress={10}
        showProgressLabel={true}
        color={'yellow'}
        animateFromValue={0}
        backgroundColor={'orange'}
        rotation={'-90deg'}
      />
      <Text style={styles.header}>Football Bingo</Text>

      <View style={styles.rowContainer}>
        <Text style={styles.timer}>{timer}s</Text>
        <Text
          style={styles.question}
          numberOfLines={2} // Limit the number of lines to 2
          ellipsizeMode="tail" // Truncate the text at the end if it exceeds the number of lines
        >
          {questions[currentQuestionIndex]?.question}
        </Text>
        <View style={styles.right}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
          <Text style={styles.questionCount}>
            {questions.length - currentQuestionIndex}{' '}left
          </Text>
        </View>
      </View>


      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[styles.progressBar, {
            width: progress.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }]}
        />
      </View>

      <View style={styles.grid}>
        {questions.map((item, index) => (
          <Animated.View style={{ transform: [{ translateX: shakeAnimation[index] }] }}>
            <TouchableOpacity
              key={item.answer.id}
              style={[
                styles.cell,
                clickedCells[index] && styles.cellClicked,
              ]}
              onPress={() => handlePress(index)}
              disabled={isGameOver || clickedCells[index]}
            >
              <LinearGradient
                colors={clickedCells[index] ? ['#FF9800', '#F44336'] : ['#4CAF50', '#388E1F']}
                style={styles.cellGradient}
              >
                {/* Show Crown on correct answer with animation */}
                {!clickedCells[index] ? (
                  <>
                    <Image
                      source={item.answer.image}
                      style={styles.cellImage}
                    />
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
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFD700', // Main color
    textAlign: 'center',
    textShadowColor: '#000', // Shadow color
    textShadowOffset: { width: 3, height: 3 }, // First shadow offset
    textShadowRadius: 10, // Blur effect for first shadow
    // Second shadow for more depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5, // For Android
    marginBottom: 20,
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#FFF',
    borderRadius: 4,
    overflow: 'hidden',
    // marginBottom: 2,
    borderColor: '#000',
    borderWidth: 0.5,
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
    marginBottom: 2,
    backgroundColor: '#36626a',
    borderRadius: 10,
  },
  timer: {
    width: '20%',
    fontSize: 30,
    color: '#BB86FC',
    textAlign: 'center',
  },
  question: {
    width: '50%',
    fontSize: 28,
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
    height: 60,
    // backgroundColor: '#555',
    padding: 8,
    borderRadius: 10,
  },
  right: {
    padding: 10,
    width: '30%',
    flexDirection: 'column', // Stack vertically
    alignItems: 'center', // Center horizontally
    justifyContent: 'center',
  },
  skipButton: {
    padding: 5,
    width: '50%',
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginBottom: 5, // Add some space between button and text
  },
  skipButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  questionCount: {
    color: '#fff', // Change color as needed
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
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#97cba9',
    margin: 2,
    overflow: 'hidden',
    position: 'relative',
    elevation: 10, // Add shadow for a 3D effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
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
    opacity: 0.6, // Fades when clicked
  },
  resultText: {
    fontSize: 20,
    color: '#FFD700',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default BingoGame;
