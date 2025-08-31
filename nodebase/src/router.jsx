import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import About from './pages/About';
import Business from './pages/Business';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';

// 事業ページをインポート
import Photography from './pages/business/Photography';
import Marriage from './pages/business/Marriage';
import Education from './pages/business/Education';
import Works from './pages/business/photography/Works';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'business',
        element: <Business />
      },
      {
        path: 'business/photography',
        element: <Photography />
      },
      {
        path: 'business/photography/works',
        element: <Works />
      },
      {
        path: 'business/marriage',
        element: <Marriage />
      },
      {
        path: 'business/education',
        element: <Education />
      },
      {
        path: 'contact',
        element: <Contact />
      },
      {
        path: 'privacy',
        element: <Privacy />
      }
    ]
  }
]);

export default router;