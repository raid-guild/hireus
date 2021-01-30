import React, { Component, createContext } from 'react';

export const AppContext = createContext();

class AppContextProvider extends Component {
  state = {
    // UX state
    stage: 1,
    // Personal Info state
    name: '',
    email: '',
    bio: '',
    discordHandle: '',
    telegramHandle: '',
    twitterHandle: '',
    contactType: '',
    // Project Info state
    projectType: '',
    projectSpecs: '',
    specsLink: '',
    projectName: '',
    projectDescription: '',
    // Services Info state
    servicesRequired: '',
    selectedDay: '',
    budgetRange: '',
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

  setPersonalData = (
    name,
    email,
    bio,
    discordHandle,
    telegramHandle,
    twitterHandle,
    contactType
  ) => {
    this.setState({
      name,
      email,
      bio,
      discordHandle,
      telegramHandle,
      twitterHandle,
      contactType
    });
  };

  setProjectData = (
    projectType,
    projectSpecs,
    specsLink,
    projectName,
    projectDescription
  ) => {
    this.setState({
      projectType,
      projectSpecs,
      specsLink,
      projectName,
      projectDescription
    });
  };

  setRequiredServicesData = (servicesRequired, selectedDay, budgetRange) => {
    this.setState({
      servicesRequired,
      selectedDay,
      budgetRange
    });
  };

  render() {
    return (
      <AppContext.Provider
        value={{
          ...this.state,
          updateStage: this.updateStage,
          setPersonalData: this.setPersonalData,
          setProjectData: this.setProjectData,
          setRequiredServicesData: this.setRequiredServicesData
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppContextProvider;
