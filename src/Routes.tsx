import { useWallet } from 'contexts/WalletContext';
import { History } from 'history';
import {
  bidLocationTemplate,
  hiringBoardLocation,
  rootLocation,
} from 'locations';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import ScrollToTop from 'utils/ScrollToTop';
import Explainer from 'views/Explainer';
import HiringBoard from 'views/HiringBoard';
import OpenBid from 'views/OpenBid';

interface CustomRouteProps {
  path: string;
  redirect?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any;
  isConnected: boolean;
  isConnecting: boolean;
  history: History;
}

const CustomRoute = (props: CustomRouteProps) => {
  const {
    path,
    redirect,
    component,
    isConnected,
    isConnecting,
    history,
    ...leftProps
  } = props;

  if (redirect) {
    return <Redirect from={path} to={redirect} {...leftProps} />;
  }

  return <Route path={path} component={component} />;
};

const routes = [
  {
    path: rootLocation,
    exact: true,
    component: Explainer,
  },
  {
    path: hiringBoardLocation,
    exact: true,
    component: HiringBoard,
  },
  {
    path: bidLocationTemplate,
    exact: true,
    component: OpenBid,
    withAuth: true,
  },
];

export default function Routes(): JSX.Element {
  const { isConnected, isConnecting } = useWallet();
  const history = useHistory();

  return (
    <>
      <ScrollToTop />
      <Switch>
        {routes.map(props => (
          <CustomRoute
            key={props.path || 'default'}
            {...props}
            isConnecting={isConnecting}
            isConnected={isConnected}
            history={history}
          />
        ))}
      </Switch>
    </>
  );
}
