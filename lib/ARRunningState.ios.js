// @flow
import { Ionicons } from '@expo/vector-icons';
import { AR } from 'expo';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

// import AR from '../__tests__/AR.mock';

class IconButton extends React.PureComponent {
  render() {
    const { style, onPress, icon } = this.props;
    return (
      <TouchableOpacity style={style} onPress={onPress}>
        <View
          style={{
            aspectRatio: 1,
            width: 56,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons name={icon} size={32} color="white" />
        </View>
      </TouchableOpacity>
    );
  }
}

class ARRunningState extends React.Component {
  state = { running: true };

  componentDidMount() {
    if (AR.isAvailable()) {
      this._onSessionWasInterrupted = AR.onSessionWasInterrupted(() => {
        this.pause();
      });
    }
  }

  componentWillUnmount() {
    if (this._onSessionWasInterrupted && this._onSessionWasInterrupted.remove)
      this._onSessionWasInterrupted.remove();
  }

  render() {
    return (
      <View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'space-between',
            padding: 24,
          },
          this.props.style,
        ]}>
        <IconButton icon={this.iconName} onPress={this.onPress} />
      </View>
    );
  }

  onPress = () => {
    this.toggleRunning();
    this.props.onPress && this.props.onPress();
  };

  pause = () => {
    if (!this.state.running) {
      return;
    }
    this.toggleRunning();
  };

  toggleRunning = () => {
    this.setState({ running: !this.state.running }, () => {
      if (!AR.isAvailable()) return;

      const { running } = this.state;
      if (running) {
        AR.resume();
      } else {
        AR.pause();
      }
    });
  };

  get iconName() {
    return this.state.running ? 'md-play' : 'md-pause';
  }
}
export default ARRunningState;
