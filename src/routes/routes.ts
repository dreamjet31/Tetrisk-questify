import { RouteProps } from 'react-router-dom';
import Home from '../pages/Home';
import Tetris from '../pages/Tetris';
import StartGame from '../pages/StartGame';

const routes: RouteProps[] = [
  {
    Component: Home,
    path: '/',
  },
  {
    Component: Tetris,
    path: '/tetris',
  },
  {
    Component: StartGame,
    path: '/start',
  }
];

export default routes;