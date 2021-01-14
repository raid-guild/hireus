import React, { Component, createContext } from 'react';

export const AppContext = createContext();

class AppContextProvider extends Component {
  state = {
    // UX state
    stage: 1,
    is_paid: true,
    // Personal Info state
    name: '',
    email: '',
    bio: '',
    discord: '',
    telegram: '',
    twitter: '',
    contact_type: '1',
    // Project Info state
    project_type: '',
    have_specs: '',
    project_name: '',
    project_desc: '',
    link: '',
    budget: '',
    deadline: '',
    //Requirement Info state
    needs: '',
    raidguild_need: '',
    priority: ''
  };

  updateStage = (type) => {
    this.setState((prevState) => {
      return {
        stage: type === 'previous' ? prevState.stage - 1 : prevState.stage + 1
      };
    });
  };

  updatePaymentChoice = () => {
    this.setState((prevState) => {
      return {
        is_paid: !prevState.is_paid
      };
    });
  };

  render() {
    return (
      <AppContext.Provider
        value={{
          ...this.state,
          updateStage: this.updateStage,
          updatePaymentChoice: this.updatePaymentChoice
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppContextProvider;
