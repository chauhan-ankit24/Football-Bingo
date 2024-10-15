// CircularTimer.tsx

import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';

const CircularTimer = ({ duration = 10 }: { duration?: number }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 1) {
                    clearInterval(interval);
                    return 1; // Timer complete
                }
                return prev + 1 / duration; // Increment progress
            });
        }, 1000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, [duration]);

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <CircularProgress
                value={progress * 100}
                radius={50}
                duration={duration * 1000} // Total duration in milliseconds
                progressValueColor={'#fff'}
                bgColor={'#3d5875'}
                strokeWidth={10}
                maxValue={100}
            />
            <Text style={{ marginTop: 10, color: '#fff' }}>{Math.ceil(duration - progress * duration)}s</Text>
        </View>
    );
};

export default CircularTimer;
