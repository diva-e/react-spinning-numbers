import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';

class Number extends Component {
  static defaultProps = {
    value: 0,
  }

  state = {
    animateTo: this.props.value,
    animateFrom: this.props.value,
    animating: false,
    queue: [],
  }

  // Force an update when the transition ended
  finishedAnimating = () => {
    this.setState({ animating: false });
    this.forceUpdate();
    if (this.state.queue.length > 0) {
      setTimeout(() => {
        const { queue } = this.state;
        const nextValue = queue.pop();
        this.setState({
          animating: true,
          animateTo: nextValue.animateTo,
          animateFrom: nextValue.animateFrom,
          queue: [],
        });
        this.forceUpdate();
      }, 1);
    }

  }

  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.state.value;
  }

  /**
   * Calculates the steps needed to show the next digit
   * If the next passed value differs from our current one, we need to calculate
   * the steps needed to get from our old value to the new value. But after
   * `componentWillReceiveProps` did finish, our old value is lost so we have
   * to store it in our state to access it later, when we render our wrapper.
   *
   * @param {Props} Object with the new value.
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      if (this.state.animating) {
        this.setState({
          queue: [ ...this.state.queue, { 
            animateTo: nextProps.value,
            animateFrom: this.props.value,
          }],
        });
      } else {
        this.setState({
          animateTo: nextProps.value,
          animateFrom: this.props.value,
          animating: true,
        });
      }
    }
  }

  /**
   * Creates an array with ten numbers
   * Since we want to have a scrolllike animation to the next number, we need
   * to create a number list, starting from our old value and ending after
   * ten steps. If `value` is `4` we end up with a list that looks
   * somethinkg like that: `[4, 5, 6, 7, 8, 9, 10, 11, 12, 13]`, sinve we are
   * only interesed in single digits, everything after the number `9` doesn't
   * make any sense, so we just do a modulo on every number and get the base
   * we can work with. Thus after applying our module operation we have our
   * final list, that looks something like this (assuming our start value is
   * still `4`): [4, 5, 6, 7, 8, 9, 0, 1, 2, 3]` et voila, we have our complete
   * list from which we can build our animatable digit list.
   *
   * @param {number} That number that starts the list.
   *
   * @returns {Array<number>} A list with numbers starting from our parameter and going
   * up till we reached `value - 1`.
   */
  getDigits(value) {
    return Array
      .from({ length: 10 })
      .map((t, index) => (index + value) % 10)
  }

  /**
   * Renders the wrapper surrounding the digits
   * If we want to animate the appearing of the new number we need a wrapper
   * elements that wraps around our number list and can be moved up to fake
   * a scrolling to the new number.
   *
   * @returns {React$Element<any>} A wrapper element for animating the scroll
   * effect for showing the new number.
   */
  render() {
    if (this.state.animating) {
      let animateTo = this.state.animateTo;
      let steps = animateTo - this.state.animateFrom;

      // If our next value is smaller than the current on display we just add
      // ten so we can safely calculate the difference between those two values
      // and get a positive number.
      if (animateTo < this.state.animateFrom) {
          animateTo += 10;
          steps = animateTo - this.state.animateFrom;
      }

      return (
        <Motion
          defaultStyle={{ y: 0 }}
          style={{ y: spring(10 * steps) }}
          onRest={this.finishedAnimating}>
          {interpolatingStyle => (
            <div style={{ float: 'left', transform: `translateY(${-interpolatingStyle.y}%)` }}>
              {this.getDigits(this.state.animateFrom).map(digit => <div key={`digit-${digit}`}>{digit}</div>)}
            </div>
          )}
        </Motion>
      )
    }

    return <div style={{ float: 'left' }}>{this.state.animateTo}</div>;
  }
}

export default Number;
