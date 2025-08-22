import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

const CropOverlay = ({ imageWidth, imageHeight, onCropAreaChange, cropEnabled }) => {
  // Initial crop area (centered, 80% of image size)
  const initialWidth = imageWidth * 0.8;
  const initialHeight = imageHeight * 0.8;
  const initialX = (imageWidth - initialWidth) / 2;
  const initialY = (imageHeight - initialHeight) / 2;

  // Shared values for crop area
  const cropX = useSharedValue(initialX);
  const cropY = useSharedValue(initialY);
  const cropWidth = useSharedValue(initialWidth);
  const cropHeight = useSharedValue(initialHeight);

  // Minimum crop size
  const minSize = 50;

  const updateCropArea = () => {
    if (onCropAreaChange) {
      onCropAreaChange({
        x: cropX.value,
        y: cropY.value,
        width: cropWidth.value,
        height: cropHeight.value,
      });
    }
  };

  // Gesture handler for moving the entire crop area
  const moveGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = cropX.value;
      context.startY = cropY.value;
    },
    onActive: (event, context) => {
      const newX = Math.max(0, Math.min(imageWidth - cropWidth.value, context.startX + event.translationX));
      const newY = Math.max(0, Math.min(imageHeight - cropHeight.value, context.startY + event.translationY));
      
      cropX.value = newX;
      cropY.value = newY;
    },
    onEnd: () => {
      runOnJS(updateCropArea)();
    },
  });

  // Gesture handlers for corner handles
  const createCornerHandler = (corner) => {
    return useAnimatedGestureHandler({
      onStart: (_, context) => {
        context.startX = cropX.value;
        context.startY = cropY.value;
        context.startWidth = cropWidth.value;
        context.startHeight = cropHeight.value;
      },
      onActive: (event, context) => {
        let newX = context.startX;
        let newY = context.startY;
        let newWidth = context.startWidth;
        let newHeight = context.startHeight;

        switch (corner) {
          case 'topLeft':
            newX = Math.max(0, Math.min(context.startX + context.startWidth - minSize, context.startX + event.translationX));
            newY = Math.max(0, Math.min(context.startY + context.startHeight - minSize, context.startY + event.translationY));
            newWidth = context.startWidth - (newX - context.startX);
            newHeight = context.startHeight - (newY - context.startY);
            break;
          case 'topRight':
            newY = Math.max(0, Math.min(context.startY + context.startHeight - minSize, context.startY + event.translationY));
            newWidth = Math.max(minSize, Math.min(imageWidth - context.startX, context.startWidth + event.translationX));
            newHeight = context.startHeight - (newY - context.startY);
            break;
          case 'bottomLeft':
            newX = Math.max(0, Math.min(context.startX + context.startWidth - minSize, context.startX + event.translationX));
            newWidth = context.startWidth - (newX - context.startX);
            newHeight = Math.max(minSize, Math.min(imageHeight - context.startY, context.startHeight + event.translationY));
            break;
          case 'bottomRight':
            newWidth = Math.max(minSize, Math.min(imageWidth - context.startX, context.startWidth + event.translationX));
            newHeight = Math.max(minSize, Math.min(imageHeight - context.startY, context.startHeight + event.translationY));
            break;
        }

        cropX.value = newX;
        cropY.value = newY;
        cropWidth.value = newWidth;
        cropHeight.value = newHeight;
      },
      onEnd: () => {
        runOnJS(updateCropArea)();
      },
    });
  };

  // Gesture handlers for edge handles
  const createEdgeHandler = (edge) => {
    return useAnimatedGestureHandler({
      onStart: (_, context) => {
        context.startX = cropX.value;
        context.startY = cropY.value;
        context.startWidth = cropWidth.value;
        context.startHeight = cropHeight.value;
      },
      onActive: (event, context) => {
        let newX = context.startX;
        let newY = context.startY;
        let newWidth = context.startWidth;
        let newHeight = context.startHeight;

        switch (edge) {
          case 'top':
            newY = Math.max(0, Math.min(context.startY + context.startHeight - minSize, context.startY + event.translationY));
            newHeight = context.startHeight - (newY - context.startY);
            break;
          case 'right':
            newWidth = Math.max(minSize, Math.min(imageWidth - context.startX, context.startWidth + event.translationX));
            break;
          case 'bottom':
            newHeight = Math.max(minSize, Math.min(imageHeight - context.startY, context.startHeight + event.translationY));
            break;
          case 'left':
            newX = Math.max(0, Math.min(context.startX + context.startWidth - minSize, context.startX + event.translationX));
            newWidth = context.startWidth - (newX - context.startX);
            break;
        }

        cropX.value = newX;
        cropY.value = newY;
        cropWidth.value = newWidth;
        cropHeight.value = newHeight;
      },
      onEnd: () => {
        runOnJS(updateCropArea)();
      },
    });
  };

  const cropAreaStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: cropX.value,
    top: cropY.value,
    width: cropWidth.value,
    height: cropHeight.value,
  }));

  if (!cropEnabled) return null;

  return (
    <View style={[styles.overlay, { width: imageWidth, height: imageHeight }]}>
      {/* Dark overlay with transparent crop area */}
      <View style={styles.darkOverlay}>
        <Animated.View style={[styles.transparentArea, cropAreaStyle]} />
      </View>

      {/* Crop area with handles */}
      <Animated.View style={[styles.cropArea, cropAreaStyle]}>
        {/* Move handle (entire crop area) */}
        <PanGestureHandler onGestureEvent={moveGestureHandler}>
          <Animated.View style={styles.moveArea} />
        </PanGestureHandler>

        {/* Corner handles */}
        <PanGestureHandler onGestureEvent={createCornerHandler('topLeft')}>
          <Animated.View style={[styles.cornerHandle, styles.topLeft]} />
        </PanGestureHandler>
        
        <PanGestureHandler onGestureEvent={createCornerHandler('topRight')}>
          <Animated.View style={[styles.cornerHandle, styles.topRight]} />
        </PanGestureHandler>
        
        <PanGestureHandler onGestureEvent={createCornerHandler('bottomLeft')}>
          <Animated.View style={[styles.cornerHandle, styles.bottomLeft]} />
        </PanGestureHandler>
        
        <PanGestureHandler onGestureEvent={createCornerHandler('bottomRight')}>
          <Animated.View style={[styles.cornerHandle, styles.bottomRight]} />
        </PanGestureHandler>

        {/* Edge handles */}
        <PanGestureHandler onGestureEvent={createEdgeHandler('top')}>
          <Animated.View style={[styles.edgeHandle, styles.topEdge]} />
        </PanGestureHandler>
        
        <PanGestureHandler onGestureEvent={createEdgeHandler('right')}>
          <Animated.View style={[styles.edgeHandle, styles.rightEdge]} />
        </PanGestureHandler>
        
        <PanGestureHandler onGestureEvent={createEdgeHandler('bottom')}>
          <Animated.View style={[styles.edgeHandle, styles.bottomEdge]} />
        </PanGestureHandler>
        
        <PanGestureHandler onGestureEvent={createEdgeHandler('left')}>
          <Animated.View style={[styles.edgeHandle, styles.leftEdge]} />
        </PanGestureHandler>

        {/* Crop border */}
        <View style={styles.cropBorder} />
        
        {/* Grid lines */}
        <View style={styles.gridContainer}>
          <View style={[styles.gridLine, styles.verticalLine1]} />
          <View style={[styles.gridLine, styles.verticalLine2]} />
          <View style={[styles.gridLine, styles.horizontalLine1]} />
          <View style={[styles.gridLine, styles.horizontalLine2]} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  transparentArea: {
    backgroundColor: 'transparent',
  },
  cropArea: {
    borderWidth: 2,
    borderColor: '#FF3366',
    borderStyle: 'dashed',
  },
  moveArea: {
    ...StyleSheet.absoluteFillObject,
  },
  cropBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: '#FF3366',
    borderStyle: 'solid',
    pointerEvents: 'none',
  },
  cornerHandle: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#FF3366',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  topLeft: { top: -10, left: -10 },
  topRight: { top: -10, right: -10 },
  bottomLeft: { bottom: -10, left: -10 },
  bottomRight: { bottom: -10, right: -10 },
  edgeHandle: {
    position: 'absolute',
    backgroundColor: '#FF3366',
    borderRadius: 4,
  },
  topEdge: {
    top: -4,
    left: '25%',
    right: '25%',
    height: 8,
  },
  rightEdge: {
    right: -4,
    top: '25%',
    bottom: '25%',
    width: 8,
  },
  bottomEdge: {
    bottom: -4,
    left: '25%',
    right: '25%',
    height: 8,
  },
  leftEdge: {
    left: -4,
    top: '25%',
    bottom: '25%',
    width: 8,
  },
  gridContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 51, 102, 0.3)',
  },
  verticalLine1: {
    left: '33.33%',
    top: 0,
    bottom: 0,
    width: 1,
  },
  verticalLine2: {
    left: '66.66%',
    top: 0,
    bottom: 0,
    width: 1,
  },
  horizontalLine1: {
    top: '33.33%',
    left: 0,
    right: 0,
    height: 1,
  },
  horizontalLine2: {
    top: '66.66%',
    left: 0,
    right: 0,
    height: 1,
  },
});

export default CropOverlay;