import { History } from 'history';
import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

function ScrollToTop({ history }: { history: History }) {
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    };
  }, [history]);

  return null;
}

export default withRouter(ScrollToTop);
