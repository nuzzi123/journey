import React, { Component } from 'react';
import TripBox from './tripBox';
import '../../App.css';
import { inject, observer } from 'mobx-react';

@inject('store')
@observer
class Trips extends Component {

  render() {
    return (
      <div>
        {this.props.store.trips.map(t => {
          return <TripBox trip={t} />
        })}
      </div>
    );
  }
}

export default Trips;